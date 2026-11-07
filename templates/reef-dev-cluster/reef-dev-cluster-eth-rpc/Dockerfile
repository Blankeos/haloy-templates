FROM anukulpandey/reef-chain-eth-rpc:latest
ENTRYPOINT ["sh","-c","/bin/sh"]
CMD ["-c","exec eth-rpc \\\n  --node-rpc-url \"$NODE_RPC_URL\" \\\n  --rpc-port \"$PORT\" \\\n  --rpc-external \\\n  --rpc-cors all\n"]
