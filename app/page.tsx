"use client";

import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { normalize } from "viem/ens";
import { useWalletClient } from "wagmi";

export default function Home() {
  const [value, setValue] = useState("");
  const [isValidENS, setIsValidENS] = useState(false);
  const [eal, setEal] = useState("");
  const [loading, setLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: walletClient } = useWalletClient();
  const [success, setSuccess] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  const checkSubdomain = async () => {
    setLoading(true);
    setErrorMessage("");
    setIsValidENS(false);
    try {
      if (!value.includes(".evm-actions.eth")) {
        setErrorMessage("subdomain must start with .evm-actions.eth");
      } else {
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http(),
        });

        const res = await publicClient.getEnsText({
          name: normalize(value.trim()),
          key: "evm-action",
        });

        if (res) {
          setErrorMessage("subdomain already exists");
        } else {
          setIsValidENS(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const createSubdomain = async () => {
    setCreationLoading(true);
    setCreationError("");
    setSuccess(false);
    try {
      if (!eal.includes("eal://")) {
        setCreationError("subdomain must start with eal://");
      } else {
        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http(),
        });

        const res = await publicClient.getEnsText({
          name: normalize(value.trim()),
          key: "evm-action",
        });

        if (res) {
          setCreationError("subdomain already exists");
        } else {
          const message = `You're about to register the following subdomain: ${value}`;

          const signedMessage = await walletClient?.signMessage({ message });

          const res = await fetch("/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message,
              signature: signedMessage,
              subdomain: value,
              eal,
            }),
          });

          const registerData = await res.json();
          console.log(registerData);

          setSuccess(true);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreationLoading(false);
    }
  };

  /**
   *
   */

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto py-16">
      <div className="flex flex-col py-8 rounded-xl overflow-hidden">
        <h1 className="text-7xl font-bold text-center text-transparent bg-gradient-to-br from-primary-500 to-primary-300 bg-clip-text">
          EVM Actions
        </h1>
        <h2 className="text-3xl text-center mt-4">
          Mass adoption is just a few clicks away.
        </h2>
      </div>
      {isLoggedIn && (
        <form
          className="flex flex-row space-x-2 max-w-[400px] mx-auto"
          onSubmit={(e) => {
            e.preventDefault();
            checkSubdomain();
          }}
        >
          <Input
            placeholder="donate.evm-actions.eth"
            className="w-full"
            isInvalid={!!errorMessage}
            errorMessage={errorMessage}
            size="lg"
            value={value}
            onValueChange={setValue}
          />
          <Button color="primary" size="lg" type="submit" isLoading={loading}>
            Check
          </Button>
        </form>
      )}
      {isValidENS && (
        <form
          className="flex flex-row space-x-2 max-w-[400px] mx-auto mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            createSubdomain();
          }}
        >
          <Input
            placeholder="eal://yourdomain.com/api/action"
            className="w-full"
            isInvalid={!!creationError}
            errorMessage={creationError}
            size="lg"
            value={eal}
            onValueChange={setEal}
          />
          <Button
            color="success"
            size="lg"
            type="submit"
            isLoading={creationLoading}
          >
            Create
          </Button>
        </form>
      )}
      {success && (
        <p className="text-emerald-500 mx-auto mt-2">ENS Record created!</p>
      )}
    </div>
  );
}
