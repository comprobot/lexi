'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export default function Home() {
  
  useEffect(() => {
    console.log("rendered");
  }, [])
  
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Button variant="elevated">I am a button - Hard works</Button>
      </div>
      <div>
        <Input placeholder="Type here..." />
      </div>
      <div>
        <Progress />
      </div>
      <div>
        <Textarea></Textarea>
      </div>
    </div>
  );
}
