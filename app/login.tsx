import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";

import { useOAuth } from "@clerk/clerk-expo";

import { defaultStyles } from "@/constants/styles";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [countryCode, setCountryCode] = useState("+251");
  const [phoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();
  const { signIn } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignIn = async (type: SignInType) => {
    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });

        const firstPhoneFactor = supportedFirstFactors.find(
          (factor) => factor.strategy === "phone_code"
        );

        if (firstPhoneFactor) {
          const { phoneNumberId } = firstPhoneFactor;

          await signIn!.prepareFirstFactor({
            strategy: "phone_code",
            phoneNumberId,
          });

          router.push({
            pathname: "/verify/[phone]",
            params: { phone: fullPhoneNumber, signIn: "true" },
          });
        }
      } catch (error) {
        console.error("error", JSON.stringify(error, null, 2));
        if (isClerkAPIResponseError(error)) {
          if (error.errors[0].code === "form_identifier_not_found") {
            Alert.alert("Error", error.errors[0].message);
          }
        }
      }
    } else if (type === SignInType.Google) {
      onPress();
    } else if (type === SignInType.Email) {
      router.push("./loginwithemail");
    }
  };

  // useWarmUpBrowser();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
      Alert.alert("OAuth Error", "An error occurred during the OAuth process.");
    }
  }, [startOAuthFlow]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome Back!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter the phone number associated with your account
        </Text>
        <View className="my-4 flex flex-row">
          <TextInput
            placeholder="Country Code"
            placeholderTextColor={Colors.gray}
            value={countryCode}
            keyboardType="numeric"
            className="bg-[#D8DCE2] p-4 rounded-2xl text-lg mr-2 w-20"
          />
          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor={Colors.gray}
            keyboardType="numeric"
            className="bg-[#D8DCE2] p-4 rounded-2xl text-lg mr-2 flex-1"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
        </View>

        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
          ]}
          onPress={() => onSignIn(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}> Continue</Text>
        </TouchableOpacity>

        <View className="flex flex-row items-center gap-4">
          <View className="flex-1 h-[1px] bg-gray-500" />
          <Text className="text-gray-500 text-lg">Or</Text>
          <View className="flex-1 h-[1px] bg-gray-500" />
        </View>
        <TouchableOpacity
          style={defaultStyles.pillButton}
          className="flex flex-row gap-4 mt-2 bg-white text-black"
          onPress={() => onSignIn(SignInType.Email)}
        >
          <Ionicons name="mail" size={24} color="#000" />
          <Text className="text-black font-[500px] text-[18px]">
            Continue With Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={defaultStyles.pillButton}
          className="flex flex-row gap-4 mt-2 bg-white text-black"
          onPress={() => onSignIn(SignInType.Google)}
        >
          <Ionicons name="logo-google" size={24} color="#000" />
          <Text className="text-black font-[500px] text-[18px]">
            Continue With Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={defaultStyles.pillButton}
          className="flex flex-row gap-4 mt-2 bg-white text-black"
          onPress={() => onSignIn(SignInType.Apple)}
        >
          <Ionicons name="logo-apple" size={24} color="#000" />
          <Text className="text-black font-[500px] text-[18px]">
            Continue With Apple
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
});

export default LoginScreen;
