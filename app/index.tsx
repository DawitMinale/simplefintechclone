import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useAssets } from "expo-asset";
import { ResizeMode, Video } from "expo-av";
import { Link } from "expo-router";
import { defaultStyles } from "@/constants/styles";
import Colors from "@/constants/Colors";

const HomeScreen = () => {
  const [assets] = useAssets([require("@/assets/videos/intro.mp4")]);

  if (!assets) {
    return (
      <ActivityIndicator
        size={50}
        className="flex justify-center items-center mt-[60%] "
      />
    );
  }

  return (
    <View style={styles.container}>
      {assets && (
        <Video
        resizeMode={ResizeMode.COVER}
          source={{ uri: assets[0]?.uri }}
          style={styles.video}
          isMuted
          isLooping
          shouldPlay
        
        />
      )}
      <View className="mt-20 p-5">
        <Text className="text-4xl font-bold text-white uppercase">
          Ready to change the way you money?
        </Text>
      </View>
      <View className="flex flex-row justify-between gap-5 m-2">
        <Link href={"/login"} style={[defaultStyles.pillButton,{flex:1,backgroundColor:Colors.dark}]} asChild>
          <TouchableOpacity onPress={() => {}}>
            <Text className="text-white px-4 text-[22px] font-[500px] ">Log in</Text>
          </TouchableOpacity>
        </Link>
        <Link href={"/signup"} style={[defaultStyles.pillButton,{flex:1,backgroundColor:"#fff"}]} asChild>
          <TouchableOpacity onPress={() => {}}>
            <Text className=" px-4 text-[22px] font-[500px] ">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
