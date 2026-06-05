<script setup>
import { ref, computed } from 'vue'
import { categories } from './data/nav.js'
import SiteModal from './components/SiteModal.vue'

const searchQuery = ref('')
const activeCategory = ref('all')
const modalItem = ref(null)
const modalCategory = ref(null)

const filteredCategories = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return categories
    .filter(cat => activeCategory.value === 'all' || cat.id === activeCategory.value)
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        if (!q) return true
        return (
          item.name.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
        )
      })
    }))
    .filter(cat => cat.items.length > 0)
})

const totalItems = computed(() => {
  return filteredCategories.value.reduce((sum, cat) => sum + cat.items.length, 0)
})

function openModal(item, category) {
  modalItem.value = item
  modalCategory.value = category
}
function closeModal() {
  modalItem.value = null
  modalCategory.value = null
}
function onCardKeydown(e, item, category) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    openModal(item, category)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="py-8 px-4 text-center">
      <div class="flex items-center justify-center gap-4 mb-2">
        <div class="w-14 h-14 bg-[#d92020] rounded-lg flex flex-col items-center justify-center shrink-0 shadow-lg shadow-[#d92020]/30">
          <span class="text-white font-bold text-lg leading-tight">漫</span>
          <span class="text-white font-bold text-lg leading-tight">藏</span>
        </div>
        <div class="text-left">
          <h1 class="text-3xl sm:text-4xl font-bold tracking-wider text-[#f3ece0]">MIRU INDEX</h1>
          <p class="text-[#c9a55c] text-sm tracking-widest mt-1">ACGN 资源导航</p>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 pb-12">
      <!-- Search -->
      <div class="mb-6">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6560]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索资源、描述、标签或分类..."
            class="w-full bg-[#181818] border border-[#2a2520] rounded-lg pl-10 pr-4 py-3 text-[#f3ece0] placeholder-[#6b6560] focus:border-[#d92020] focus:outline-none transition"
            aria-label="搜索资源"
          />
        </div>
      </div>

      <!-- Category Chips -->
      <div class="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide" role="tablist">
        <button
          role="tab" :aria-selected="activeCategory === 'all'"
          @click="activeCategory = 'all'"
          class="px-4 py-2 rounded-full border transition whitespace-nowrap text-sm focus:outline-none focus:ring-2 focus:ring-[#d92020] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          :class="activeCategory === 'all'
            ? 'bg-[#d92020] border-[#d92020] text-white shadow-md shadow-[#d92020]/30'
            : 'bg-transparent border-[#2a2520] text-[#9a9590] hover:border-[#d92020] hover:text-[#f3ece0]'"
        >
          全部
        </button>
        <button
          v-for="cat in categories" :key="cat.id"
          role="tab" :aria-selected="activeCategory === cat.id"
          @click="activeCategory = cat.id"
          class="px-4 py-2 rounded-full border transition whitespace-nowrap text-sm focus:outline-none focus:ring-2 focus:ring-[#d92020] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          :class="activeCategory === cat.id
            ? 'bg-[#d92020] border-[#d92020] text-white shadow-md shadow-[#d92020]/30'
            : 'bg-transparent border-[#2a2520] text-[#9a9590] hover:border-[#d92020] hover:text-[#f3ece0]'"
        >
          <span>{{ cat.icon }}</span> {{ cat.name }}
        </button>
      </div>

      <!-- Results count -->
      <p class="text-[#6b6560] text-sm mb-4">
        共 <span class="text-[#c9a55c] font-semibold">{{ totalItems }}</span> 个资源
        <span v-if="activeCategory !== 'all'" class="text-[#6b6560]"> · {{ categories.find(c => c.id === activeCategory)?.name }}</span>
      </p>

      <!-- Sections -->
      <section v-for="cat in filteredCategories" :key="cat.id" class="mb-10 content-visibility-auto">
        <h2 class="text-xl font-bold text-[#c9a55c] mb-4 flex items-center gap-2 border-b border-[#2a2520] pb-2">
          <span class="text-2xl">{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
          <span class="text-xs text-[#6b6560] font-normal ml-1">({{ cat.items.length }})</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <button
            v-for="item in cat.items" :key="item.name"
            type="button"
            @click="openModal(item, cat)"
            @keydown="onCardKeydown($event, item, cat)"
            class="block w-full text-left p-5 bg-[#181818] border border-[#2a2520] rounded-lg hover:border-[#d92020] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#d92020]/10 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#d92020] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-lg font-bold text-[#f3ece0] group-hover:text-[#d92020] transition-colors">{{ item.name }}</h3>
              <span v-if="item.proxy" class="text-[10px] px-1.5 py-0.5 rounded bg-[#d92020]/10 text-[#d92020] border border-[#d92020]/30 whitespace-nowrap shrink-0">需梯子</span>
            </div>
            <p class="text-sm text-[#9a9590] leading-relaxed line-clamp-2 mb-2">{{ item.desc }}</p>
            <div v-if="item.tags?.length" class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="t in item.tags.slice(0, 3)" :key="t"
                class="text-[10px] px-1.5 py-0.5 rounded bg-[#c9a55c]/10 text-[#c9a55c] border border-[#c9a55c]/20"
              >#{{ t }}</span>
            </div>
          </button>
        </div>
      </section>

      <!-- Empty -->
      <div v-if="filteredCategories.length === 0" class="text-center py-20">
        <p class="text-[#6b6560] text-lg">没有找到匹配的资源</p>
        <button
          @click="searchQuery = ''; activeCategory = 'all'"
          class="mt-4 text-[#d92020] hover:underline focus:outline-none focus:ring-2 focus:ring-[#d92020] rounded px-2 py-1"
        >
          清除搜索
        </button>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 px-4 text-center border-t border-[#2a2520]">
      <p class="text-[#6b6560] text-sm">漫藏 · MIRU INDEX — ACGN 资源导航</p>
    </footer>

    <!-- Modal -->
    <SiteModal
      v-if="modalItem"
      :item="modalItem"
      :category="modalCategory"
      @close="closeModal"
    />
  </div>
</template>
