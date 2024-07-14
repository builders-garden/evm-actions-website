import { REGISTRY_ABI, REGISTRY_ADDRESS } from "@/lib/const";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  createPublicClient,
  createWalletClient,
  http,
  recoverMessageAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export async function POST(req: NextRequest, res: NextResponse) {
  const { message, signature, subdomain, eal } = await req.json();

  const address = await recoverMessageAddress({ message, signature });

  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
  );

  const { data: record } = await supabase
    .from("records")
    .select("*")
    .eq("subdomain", subdomain)
    .single();

  if (record) {
    return NextResponse.json({ error: "subdomain already exists" });
  }

  const { data, error } = await supabase.from("records").insert([
    {
      owner: address,
      name: subdomain,
      texts: {
        "evm-action": eal,
      },
    },
  ]);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to register subdomain" },
      { status: 500 }
    );
  }

  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  const client = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });
  const publicClient = createPublicClient({ chain: base, transport: http() });

  const addActionTx = await client.writeContract({
    abi: REGISTRY_ABI,
    address: REGISTRY_ADDRESS,
    functionName: "addNewAction",
    args: [eal],
  });

  await publicClient.waitForTransactionReceipt({ hash: addActionTx });

  const confirmActionTx = await client.writeContract({
    abi: REGISTRY_ABI,
    address: REGISTRY_ADDRESS,
    functionName: "confirmAction",
    args: [eal],
  });

  await publicClient.waitForTransactionReceipt({ hash: confirmActionTx });

  return NextResponse.json({ result: data });
}
