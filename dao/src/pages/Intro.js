import React from "react";
import { useWallet } from "use-wallet";
import { useNavigate } from "react-router-dom";
import {
  Main,
  Button,
  Split,
  Box,
  GU,
  Bar,
  BackButton,
  textStyle,
  IdentityBadge,
  IconWallet,
  IconConnection,
  Card,
  TokenAmount,
  Header,
  EmptyStateCard,
  EthIdenticon,
  TextInput,
  Tabs
} from "@aragon/ui";

function intro() {
  return (
    <>
      <Box heading="Intoduction">
      <Button label="Edit" mode="strong"/>
      </Box>
      
      <Box heading="Basic Information">
        <div>twitter:</div>
        <div>discord:</div>
        <div>email:</div>
        <div>website:</div>
        </Box>  
        
     
    </>
  );
}

export default intro;
