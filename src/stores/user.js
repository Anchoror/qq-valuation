export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const ossConfig = ref({})
    const uid = ref(null)
    const expire = ref('')
    const name = ref('')
    const avatar = ref('')
    return {
      token,
      ossConfig,
      uid,
      expire,
      name,
      avatar,
    }
  },
  {
    persist: {
      paths: ['token', 'uid', 'name']
    }
  }
)
