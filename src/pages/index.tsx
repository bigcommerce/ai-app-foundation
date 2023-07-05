import { Flex, H2, Panel } from "@bigcommerce/big-design";
import Link from 'next/link';

export default function Home() {
  return (
    <Panel header="Copilot">
      <H2>You should use Control panel Add-Edit page</H2>
      <Flex flexDirection="column">
        <Link href="/productAppExtension/1">App extension option</Link>
      </Flex>
    </Panel >
  );
}
