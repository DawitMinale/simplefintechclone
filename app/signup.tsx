import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { defaultStyles } from "@/constants/styles";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";

const SignupScreen = () => {
  const [countryCode, setCountryCode] = useState("+251");
  const [phoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();
  const { signUp } = useSignUp();


  const onSignUp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    try {
      await signUp!.create({
        phoneNumber: fullPhoneNumber,
      });
      await signUp!.preparePhoneNumberVerification({strategy:"phone_code"});
      router.push({
        pathname: "/verify/[phone]",
        params: { phone: fullPhoneNumber },
      });
      console.log("succeesss");
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's Get Started!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number.we will send you a confirmation code there
        </Text>
        <View className="my-16 flex flex-row">
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
        <Link href={"/login"} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </Link>
        <View className="flex-1"></View>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            phoneNumber !== "" ? styles.enabled : styles.disabled,
          ]}
          onPress={onSignUp}
          className="mt-5 "
        >
          <Text style={defaultStyles.buttonText}> Sign Up</Text>
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

export default SignupScreen;
