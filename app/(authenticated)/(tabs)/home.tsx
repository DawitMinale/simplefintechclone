import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import RoundBtn from "@/components/RoundBtn";
import DropDown from "@/components/DropDown";
import { useBalanceStore } from "@/store/balanceStore";
import { defaultStyles } from "@/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import WidgetList from "@/components/SortableList/WidgetList";
import {useHeaderHeight} from "@react-navigation/elements"

const Home = () => {
  const { balance, runTransaction, transaction, clearTransactions } =
    useBalanceStore();


    const headerHeight=useHeaderHeight()

  const onAddMoney = () => {
    runTransaction({
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      description: "Added Money",
    });
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{
      paddingTop:headerHeight
    }}>
      <View className="" style={styles.account}>
        <View className="" style={styles.row}>
          <Text className="" style={styles.balance}>
            {balance()}
          </Text>
          <Text className=" " style={styles.currency}>
            €
          </Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <RoundBtn icon={"add"} text="Add Money" onPress={onAddMoney} />
        <RoundBtn
          icon={"refresh"}
          text="Exchange"
          onPress={clearTransactions}
        />
        <RoundBtn icon={"list"} text="Details" onPress={() => {}} />
        <DropDown />
      </View>
      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {transaction.length === 0 && (
          <Text style={{ padding: 14, color: Colors.gray }}>
            No Transactions yet
          </Text>
        )}
        {transaction.map((eachTransaction, index) => {
          return (
            <View key={eachTransaction.id} style={{ flexDirection: "row" ,alignItems:"center",gap:20}}>
              <View style={styles.circle}>
                <Ionicons
                  name={eachTransaction.amount > 0 ? "add" : "remove"}
                  size={24}
                  color={Colors.dark}
                />
              </View>
              <View style={{flex:1}}>
                <Text style={{fontWeight:"400"}}> {eachTransaction.description}</Text>
                <Text style={{color:Colors.gray,fontSize:12}}>{eachTransaction.date.toLocaleString()}</Text>
              </View>
              <Text >{eachTransaction.amount}€</Text>
            </View>
          );
        })}
      </View>
      <Text style={defaultStyles.sectionHeader}>Widgets</Text>
      <WidgetList/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 60,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
  },
  balance: {
    fontSize: 60,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 30,
    fontWeight: "500",
    marginLeft: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  transactions: {
    padding: 14,

    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Home;
