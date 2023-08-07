import { Flex, Text, Tooltip } from '@bigcommerce/big-design';
import { BaselineHelpIcon } from '@bigcommerce/big-design-icons';
import React from 'react';

interface InputLabelProps {
  text: string;
  tooltip: string;
  bold: boolean;
}

export const InputLabel = ({ text, tooltip, bold }: InputLabelProps) => (
  <Flex flexDirection="row" marginBottom="xxSmall" alignItems="center">
    <Text as="span" bold={bold} marginBottom="none" marginRight="xxSmall">
      {text}
    </Text>
    <Tooltip
      placement="right"
      trigger={<BaselineHelpIcon color="secondary50" size="large" />}
    >
      {tooltip}
    </Tooltip>
  </Flex>
);
