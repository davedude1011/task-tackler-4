"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import NavBar from "../components/navbar";

export default function Page() {
  const [socket, setSocket] = useState(null); // Store the socket connection here
  const [message, setMessage] = useState(""); // Store message from the server
  const [input, setInput] = useState(""); // Store user input
  const [reciever_clerk, set_reciever_clerk] = useState(""); // Store user input

  const user = useAuth();

  useEffect(() => {
    if (user.isSignedIn) {
      const socketConnection = io(process.env.NEXT_PUBLIC_SOCKET_URL);
      // @ts-expect-error this is a test anyways
      setSocket(socketConnection);

      console.log(user.userId);
      socketConnection.emit("set_clerk_id", user.userId);

      socketConnection.on("send_message_to_client", (msg) => {
        console.log("Received from server:", msg);
      });

      return () => {
        socketConnection.close();
        console.log("Socket connection closed");
      };
    }
  }, [user.isSignedIn, user.userId]);

  const handleSend = () => {
    if (socket && input.trim()) {
      // @ts-expect-error this line just doesnt like me :I
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      socket.emit("send_message_to_server", {
        message: input,
        sender_clerk: user.userId,
        reciever_clerk: reciever_clerk,
      });
      setInput("");
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Socket.IO Client Test</h1>
      <div className="flex flex-col gap-2">
        <div>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)} // Update input value
            placeholder="Type your message"
          />
        </div>
        <div>
          <Input
            type="text"
            value={reciever_clerk}
            onChange={(e) => set_reciever_clerk(e.target.value)} // Update input value
            placeholder="Enter the recievers ClerkID"
          />
        </div>
        <div>
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
      <div>
        <h2>Message from Server:</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
