import { Amplify, Auth } from "aws-amplify";
import { View, Image, Text, Flex, Divider } from "@aws-amplify/ui-react";

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_AMPLIFY_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_AMPLIFY_CLIENT_ID,
    mandatorySignIn: "enable",
    oauth: {
      domain: process.env.NEXT_PUBLIC_AMPLIFY_DOMAIN,
      scope: JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_SCOPE),
      redirectSignIn: process.env.NEXT_PUBLIC_AMPLIFY_REDIRECT_SIGNIN,
      redirectSignOut: process.env.NEXT_PUBLIC_AMPLIFY_REDIRECT_OUT,
      responseType: "code"
    }
  }
});

export const config = Auth.configure();

export const components = {
  Header() {

    return (
      <Flex boxShadow={"0px 2px 4px -2px rgba(16, 24, 40, 0.10), 0px 4px 6px -1px rgba(16, 24, 40, 0.10)"} justifyContent="center" alignItems={"center"} direction={"column"}>
        <View backgroundColor="#003c69" height={56} padding={"18px 0 18px 16px"} width={"100%"}>
          <Text
            variation="secondary"
            as="p"
            color="white"
            lineHeight="1.25rem"
            fontWeight={500}
            fontSize="1rem"
            fontFamily="Fira Sans, sans-serif"
            textDecoration="none"
          >
            Authorised Booking Entity
          </Text>
        </View>
        <View padding="0.2rem 1rem">
          <Image
            alt="Logo"
            src="/Logo.png"
          />

        </View>
        <Divider style={{ background: "#16A34A", height: "3px", borderStyle: "none", opacity: "1" }}>
        </Divider>

      </Flex>
    );
  },

  SignIn: {
    Footer() {
      return (
        <></>
      );
    },
  },
};

export const formFields = {
  signIn: {
    username: {
      label: "Email Address",
      placeholder: "",
    },
    password: {
      label: "Password",
      placeholder: "",
    },
  },
};

