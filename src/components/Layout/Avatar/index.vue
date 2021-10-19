<template>
  <v-list-item
    two-line
    class="avatar"
    :class="drawer && 'px-2'"
    @click.stop="handleAvatar"
  >
    <v-list-item-avatar>
      <v-img
        :src="userInfo.userId ? userInfo.avatarUrl : defaultAvatar"
        @error="setDefaultAvatar"
      />
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ userInfo.userId ? userInfo.nickname : '请登录' }}</v-list-item-title>
      <v-list-item-subtitle>{{ userInfo.userId ? `村龄：${ villageAge(userInfo.account.createTime) }` : '登录以查看更多' }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { villageAge } from '@/utils/dateTime'

export default {
  name: 'Avatar',
  props: ['drawer', 'userInfo'],
  data() {
    return {
      villageAge,
      defaultAvatar: require('@/assets/images/defaultAvatar.svg')
    };
  },
  methods: {
    setDefaultAvatar() {
      this.avatar = this.defaultAvatar
    },
    handleAvatar() {
      this.userInfo?.userId
        ? this.$router.push({ name: 'User' })
        : this.$router.push({ name: 'Login' })
    }
  },
};
</script>

<style scoped lang="scss">
.avatar {
  cursor: pointer;
  transition: var(--animationTime);
  padding: 0 8px !important;
}
</style>