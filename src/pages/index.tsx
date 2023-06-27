import { Panel } from "@bigcommerce/big-design";
import Head from "next/head";
import { api } from "~/utils/api";
import DescriptionGenerator from "~/components/DescriptionGenerator";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from next tRPC" });

  return (
    <>
      <Head>
        <title>Control Panel AI App</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      {hello.data?.greeting}
      <Panel header="Control Panel AI App">
        <DescriptionGenerator />
      </Panel>

    </>
  );
}
