import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Board = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    { id: 1, title: "첫 번째 게시글", author: "작성자1", date: "2024-03-20" },
    { id: 2, title: "두 번째 게시글", author: "작성자2", date: "2024-03-21" },
  ]);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    setFilteredPosts(
      posts.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, posts]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.postItem}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.postInfo}>
        <Text style={styles.author}>{item.author}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home', { isLoggedIn: true })}>
          <Text style={styles.backButton}>← 홈으로</Text>
        </TouchableOpacity>
        <Text style={styles.header}>게시판</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.writeButton}>
        <Text style={styles.writeButtonText}>+ 글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  backButton: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  postItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  postInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  author: {
    color: "#666",
  },
  date: {
    color: "#666",
  },
  writeButton: {
    position: "absolute",
    right: 20,
    bottom: 60,
    backgroundColor: "#FFEDAE",
    padding: 16,
    borderRadius: 30,
  },
  writeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  searchContainer: {
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
});

export default Board;
