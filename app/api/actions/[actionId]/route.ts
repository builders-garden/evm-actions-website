import { REGISTRY_ABI, REGISTRY_ADDRESS } from "@/lib/const";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  createWalletClient,
  http,
  createPublicClient,
  recoverMessageAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { actionId: string } }
) {
  try {
    const { actionId } = params;
    const { message, signature } = await req.json();

    const address = await recoverMessageAddress({ message, signature });

    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_KEY as string
    );

    const { data: record } = await supabase
      .from("records")
      .select("*")
      .eq("id", parseInt(actionId))
      .single();

    if (!record) {
      return NextResponse.json({ error: "no record found" }, { status: 404 });
    }

    if (record.owner !== address) {
      return NextResponse.json(
        { error: "you are not the owner of this record" },
        { status: 403 }
      );
    }

    await supabase.from("records").delete().eq("id", parseInt(actionId));

    const account = privateKeyToAccount(
      process.env.PRIVATE_KEY as `0x${string}`
    );

    const client = createWalletClient({
      account,
      chain: base,
      transport: http(),
    });
    const publicClient = createPublicClient({ chain: base, transport: http() });

    const removeActionTx = await client.writeContract({
      abi: REGISTRY_ABI,
      address: REGISTRY_ADDRESS as `0x${string}`,
      functionName: "removeAction",
      args: [record.texts["evm-action"]],
    });

    await publicClient.waitForTransactionReceipt({ hash: removeActionTx });

    return NextResponse.json({ result: "ok" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
