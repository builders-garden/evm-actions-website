"use client";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { Button, Card, CardBody, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";

export default function Actions() {
  const isLoggedIn = useIsLoggedIn();
  const [actions, setActions] = useState<any[]>([]);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && address) {
      // fetch actions
      fetchActions();
    }
  }, [isLoggedIn, address]);

  const fetchActions = async () => {
    const res = await fetch(`/api/actions?address=${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { result } = await res.json();
    setActions(result);
  };

  const deleteAction = async (id: string) => {
    setLoading(true);
    try {
      const message = `You're about to delete this action. Are you sure?`;

      const signedMessage = await walletClient?.signMessage({ message });

      const res = await fetch(`/api/actions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          signature: signedMessage,
        }),
      });

      const { actionId } = await res.json();
      if (actionId) {
        setActions((prev) => prev.filter((action) => action.id !== actionId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto py-16">
      <div className="max-w-[720px] px-8 mx-auto space-y-4">
        <h1 className="text-7xl font-bold text-center text-transparent bg-gradient-to-br from-primary-500 to-primary-300 bg-clip-text">
          My Actions
        </h1>
        {actions.length === 0 && <p>No action registered yet!</p>}
        {actions.map((action) => (
          <Card key={action.id}>
            <CardBody className="flex flex-row items-center justify-between">
              <Link
                href={`https://app.ens.domains/${action.name}`}
                isExternal
                className="font-semibold"
              >
                {action.name}
              </Link>
              <div className="flex flex-row space-x-2">
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onClick={() => deleteAction(action.id)}
                  isDisabled={loading}
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
