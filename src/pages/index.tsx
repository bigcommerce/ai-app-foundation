import { Panel } from "@bigcommerce/big-design";
import Link from 'next/link';

export default function Home() {
  return (
    <Panel header="Control Panel AI App">
      Go to <Link href="/productAppExtension/1">product panel!</Link>
    </Panel>
  );
}
