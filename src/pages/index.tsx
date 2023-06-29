import { Flex, Panel } from "@bigcommerce/big-design";
import Link from 'next/link';

export default function Home() {
  return (
    <Panel header="Control Panel AI App">
      <Flex flexDirection="column">
        <Link href="/productAppExtension/1">App extension option</Link>
        <Link href="/modal-option">Modal option</Link>
      </Flex>
    </Panel>
  );
}
