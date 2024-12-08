import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import COLORS from '../utils/colors';
import { createPost } from '../api/posts';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CreatePost = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  const { mutate: submitPost, isLoading } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigation.goBack();
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    },
  });

  const handlePost = () => {
    submitPost({ title, description });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Icon name="xmark" size={20} color={COLORS.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            placeholderTextColor={COLORS.muted}
            maxLength={300}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.descriptionInput}
            placeholder="Body text"
            placeholderTextColor={COLORS.muted}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.postButton, (!title.trim() || !description.trim()) && styles.disabledButton]}
            onPress={handlePost}
            disabled={isLoading || !title.trim() || !description.trim()}
          >
            {isLoading ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.postButtonText}>Post</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  inputContainer: {
    padding: 16,
    flex: 1,
  },
  titleInput: {
    fontSize: 16,
    color: COLORS.foreground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    marginBottom: 16,
  },
  descriptionInput: {
    fontSize: 16,
    color: COLORS.foreground,
    height: 200,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 15,
    marginTop: 'auto',
  },
  postButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  postButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
