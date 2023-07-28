import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Custom404() {
  const [isNotFound, setIsNotFound] = useState(false);

  const router = useRouter();

  useEffect(() => {

    if (window.location.pathname.includes("new_report"))
      return router.push("/new_report.html");

    return setIsNotFound(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isNotFound) return <h1>404 - Page Not Found</h1>;

  return null;
}