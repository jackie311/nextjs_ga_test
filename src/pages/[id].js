
import EditReport from "@/components/editReport";
import { Authenticator } from '@aws-amplify/ui-react';
import { components, formFields } from "@/amplifyConfig";

export default function Main() {

  return (
    <Authenticator
      hideSignUp={true}
      formFields={formFields}
      components={components}
      submitButtonContent="Login"
    >
      <EditReport />
    </Authenticator>
  )
}