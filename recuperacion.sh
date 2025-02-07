for blob in $(git fsck --lost-found | grep "dangling blob" | awk '{print $3}'); do
  content=$(git cat-file -p $blob)
  echo "$content" > recovered_files/$blob.txt
done