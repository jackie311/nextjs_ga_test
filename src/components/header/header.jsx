import { useEffect, useState, useContext } from 'react';
import { Auth } from "aws-amplify";
import { EntityContext } from '@/context/globalContext';
import { Card, Flex, Image, View, Text } from '@aws-amplify/ui-react';;

export default function Header() {
  const [user, setUser] = useState("");
  const context = useContext(EntityContext);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        const { attributes = {} } = user;
        const { email, given_name, family_name } = attributes;
        given_name ? setUser(`${given_name} ${family_name}`) : setUser(email);
      })
  }, [])

  return (
    <Flex
      direction="column"
    >
      <View
        height="10rem"
        display="flex"
        direction="column"
        boxShadow="0px 4px 12px 0px rgba(0, 0, 0, 0.12)"
        style={{ borderBottom: "3px solid rgba(22, 163, 74, 0.8)" }}
      >
        <Image
          alt="Logo"
          src="/Logo.png"
          width="466px"
          height="50px"
          margin="1.5rem 2rem"
        />
        <Card
          backgroundColor="#003c69"
          display="flex"
          height="6rem"
          justifyContent="space-between"
          padding="1rem 3rem"
          alignItems="center"
         // style={{marginBottom: "1rem"}}
        >
          <Text color="#fff" fontWeight="500" fontFamily="Fira Sans, sans-serif">{context.name}</Text>
          <Text color="#fff" fontWeight="500" fontFamily="Fira Sans, sans-serif">{context.primary_contact}</Text>
        </Card>
      </View>
    </Flex>
  )
}