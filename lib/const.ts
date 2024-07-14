export const REGISTRY_ADDRESS = "0x4df80936f67cA33E5Ddc40159652Ab8dd4f100c5";

export const REGISTRY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "actionBaseUrl",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "actionOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum ActionsRegistry.ActionStatus",
        name: "status",
        type: "uint8",
      },
    ],
    name: "ActionAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "actionBaseUrl",
        type: "string",
      },
    ],
    name: "ActionConfirmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "actionBaseUrl",
        type: "string",
      },
    ],
    name: "ActionRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "actions",
    outputs: [
      {
        internalType: "enum ActionsRegistry.ActionStatus",
        name: "status",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "actionOwner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "actionBaseUrl",
        type: "string",
      },
    ],
    name: "addNewAction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "actionBaseUrl",
        type: "string",
      },
    ],
    name: "confirmAction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "actionBaseUrl",
        type: "string",
      },
    ],
    name: "removeAction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "restricted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_restricted",
        type: "bool",
      },
    ],
    name: "setRestricted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
