'use client';

import * as Sentry from "@sentry/nextjs";
import { Button, FlexItem, H2, Text } from '@bigcommerce/big-design';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <FlexItem>
      <H2>Something went wrong!</H2>
      <Text>{error.message}</Text>
      <Button mobileWidth="auto" onClick={reset}>
        Try again
      </Button>
    </FlexItem>
  );
}
