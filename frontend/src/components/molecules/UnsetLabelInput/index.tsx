import React from 'react';
import styled from 'styled-components';
import Label from '../../atoms/Label';
import UnsetInput from '../../atoms/UnsetInput';
import { LabelInputContent } from '../../../models/common';

interface UnsetLabelInputProps extends LabelInputContent {
  type: string;
  style?: object;
}

const LinedBox = styled.div`
  display: flex;
  flex-direction: column;
  border-width: none none 5px none;
  border-color: #66d291;
  border-style: none none solid none;
  width: 400px;
  padding: 5px none;
`;

const UnsetLabelInput = ({ label, placeholder }: LabelInputContent) => {
  return (
    <Wrapper>
      <LinedBox>
        <Label>{label}</Label>
        <UnsetInput placeholder={placeholder} />
      </LinedBox>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default UnsetLabelInput;
