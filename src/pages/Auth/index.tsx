import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  signUpSchema,
  type LoginSchema,
  type SignUpSchema,
} from "@/validators/auth-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/assets/logo.svg?react";
import LogoDark from "@/assets/logo-dark.svg?react";
import { useAuthDataLogin, useAuthDataSignUp } from "@/hooks/api/use-auth-data";
import { useTheme } from "@/components/theme-provider";
import toast from "react-hot-toast";

export const Auth = () => {
  const { isPending: isLoginLoading, mutate: loginMutate } = useAuthDataLogin();
  const { isPending: isSignUpLoading, mutate: signUpMutate } =
    useAuthDataSignUp();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const username = loginForm.watch("username");
  const password = loginForm.watch("password");

  const signUpForm = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const signupName = signUpForm.watch("name");
  const signupUsername = signUpForm.watch("username");
  const signupPassword = signUpForm.watch("password");

  const onSubmitLogin = (data: LoginSchema) => {
    loginMutate(
      { username: data.username, password: data.password },
      {
        onError: () => {
          toast.error("Ocorreu um erro ao fazer login");
        },
      }
    );
  };

  const onSubmitSignUp = (data: SignUpSchema) => {
    signUpMutate(
      {
        name: data.name,
        username: data.username,
        password: data.password,
      },
      {
        onError: () => {
          toast.error("Ocorreu um erro ao criar conta");
        },
      }
    );
  };

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <Card
        className={`transition-all duration-300 ${
          activeTab === "login"
            ? "min-h-[300px] max-h-[400px] w-[350px]"
            : "min-h-[330px] max-h-[400px] w-[350px]"
        }`}
      >
        {theme === "dark" ? (
          <Logo className="h-8" />
        ) : (
          <LogoDark className="h-8" />
        )}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
          <CardHeader>
            <TabsList className="w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="login">
            <CardContent>
              <form
                onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                className="flex flex-col gap-2.5 h-full"
              >
                <Input
                  type="text"
                  placeholder="Nome de usuário"
                  {...loginForm.register("username")}
                />
                {loginForm.formState.errors.username && (
                  <p className="text-red-500 text-sm">
                    {loginForm.formState.errors.username.message}
                  </p>
                )}

                <Input
                  type="password"
                  placeholder="Senha"
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoginLoading || !username || !password}
                >
                  {isLoginLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="signup">
            <CardContent>
              <form
                onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
                className="flex flex-col gap-2.5 h-full"
              >
                <Input
                  type="text"
                  placeholder="Seu nome"
                  {...signUpForm.register("name")}
                />
                {signUpForm.formState.errors.name && (
                  <p className="text-red-500 text-sm">
                    {signUpForm.formState.errors.name?.message}
                  </p>
                )}

                <Input
                  type="text"
                  placeholder="Crie um nome de usuário"
                  {...signUpForm.register("username")}
                />
                {signUpForm.formState.errors.username && (
                  <p className="text-red-500 text-sm">
                    {signUpForm.formState.errors.username?.message}
                  </p>
                )}

                <Input
                  type="password"
                  placeholder="Informe uma senha"
                  {...signUpForm.register("password")}
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-red-500 text-sm">
                    {signUpForm.formState.errors.password?.message}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={
                    isSignUpLoading ||
                    !signupName ||
                    !signupUsername ||
                    !signupPassword
                  }
                >
                  {isSignUpLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    "Cadastrar"
                  )}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
