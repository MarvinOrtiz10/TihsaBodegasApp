import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import VerificationToken from "./VerificationToken";

const App = () => {
  const tokenLength = 6;
  const [token, setToken] = useState("");
  const [filled, setFilled] = useState(false);

  const onTokenChanged = (newToken) => {
    const filled = newToken.length === tokenLength;

    if (token !== newToken || filled !== currentFilled) {
      setToken(newToken);
      setFilled(filled);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <VerificationToken
        inputClass="font-weight-bold text-center text-secondary rounded"
        tokenLength={tokenLength}
        onTokenChanged={onTokenChanged}
      />
      {filled && <Button title="Verify" onPress={() => {}} />}
    </View>
  );
};

export default App;
