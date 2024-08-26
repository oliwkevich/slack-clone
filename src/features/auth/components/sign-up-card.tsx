import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dispatch, SetStateAction, useState } from "react";
import { SignInFlow } from "../types";

interface Props {
  setState: Dispatch<SetStateAction<SignInFlow>>;
}

export const SignUpCard = ({ setState }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Реєстрація</CardTitle>
        <CardDescription>
          Використовуйте ваш email або інший сервіс щоб продовжити
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            placeholder="Електронна адреса"
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
          <Input
            placeholder="Пароль"
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
          <Input
            placeholder="Підтвердіть пароль"
            disabled={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            type="password"
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Створити
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            className="w-full relative"
            disabled={false}
            onClick={() => {}}
            variant="outline"
            size="lg"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Створити через Google
          </Button>
          <Button
            className="w-full relative"
            disabled={false}
            onClick={() => {}}
            variant="outline"
            size="lg"
          >
            <FaGithub className="size-5 absolute top-3 left-3" />
            Створити через GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Вже є створений акаунт?{" "}
          <span
            onClick={() => setState("signIn")}
            className="text-sky-700 cursor-pointer hover:underline"
          >
            Увійти
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
