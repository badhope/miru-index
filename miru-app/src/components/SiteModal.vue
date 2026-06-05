<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  category: { type: Object, default: null }
})
const emit = defineEmits(['close'])

const dialogRef = ref(null)
const enterBtnRef = ref(null)
const copied = ref(false)

function onBackdropClick(e) {
  if (e.target === e.currentTarget) emit('close')
}
function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'Tab') trapFocus(e)
}
function trapFocus(e) {
  if (!dialogRef.value) return
  const focusable = dialogRef.value.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus()
  }
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(props.item.url)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    // 回退：创建临时 input
    const ta = document.createElement('textarea')
    ta.value = props.item.url
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy'); copied.value = true; setTimeout(() => (copied.value = false), 1500) } catch {}
    document.body.removeChild(ta)
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  // 锁滚动
  document.body.style.overflow = 'hidden'
  nextTick(() => enterBtnRef.value?.focus())
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md modal-backdrop"
      role="dialog" aria-modal="true" :aria-label="item.name"
      @click="onBackdropClick"
    >
      <div
        ref="dialogRef"
        class="modal-panel relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-[#181818] border border-[#2a2520] sm:border-[#d92020]/40 sm:rounded-2xl rounded-t-2xl shadow-2xl"
      >
        <!-- 关闭按钮 -->
        <button
          @click="emit('close')"
          aria-label="关闭"
          class="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0a0a0a]/80 border border-[#2a2520] text-[#9a9590] hover:text-[#d92020] hover:border-[#d92020] flex items-center justify-center transition z-10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <!-- 头部 -->
        <header class="p-6 sm:p-8 pb-4 border-b border-[#2a2520]">
          <div class="flex items-center gap-2 mb-3 text-xs">
            <span v-if="category" class="text-[#6b6560]">{{ category.icon }} {{ category.name }}</span>
            <span v-if="category && item.proxy" class="text-[#2a2520]">·</span>
            <span v-if="item.proxy" class="text-[#d92020] border border-[#d92020]/40 bg-[#d92020]/10 px-2 py-0.5 rounded">需梯子</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-[#f3ece0] leading-tight pr-8">{{ item.name }}</h2>
          <p v-if="item.desc" class="text-[#9a9590] mt-2 text-sm">{{ item.desc }}</p>
        </header>

        <!-- 主体 -->
        <div class="p-6 sm:p-8 space-y-5">
          <!-- 标签 -->
          <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="t in item.tags" :key="t"
              class="text-xs px-2.5 py-1 rounded-full bg-[#c9a55c]/10 text-[#c9a55c] border border-[#c9a55c]/30"
            >#{{ t }}</span>
          </div>

          <!-- 详细介绍 -->
          <section v-if="item.fullDesc">
            <h3 class="text-xs uppercase tracking-widest text-[#6b6560] mb-2">介绍</h3>
            <p class="text-[#f3ece0] leading-relaxed text-[15px]">{{ item.fullDesc }}</p>
          </section>

          <!-- 特色 -->
          <section v-if="item.features?.length">
            <h3 class="text-xs uppercase tracking-widest text-[#6b6560] mb-2">特色</h3>
            <ul class="space-y-1.5">
              <li
                v-for="(f, i) in item.features" :key="i"
                class="flex items-start gap-2 text-[#f3ece0] text-[15px]"
              >
                <span class="text-[#d92020] mt-1 shrink-0">▸</span>
                <span>{{ f }}</span>
              </li>
            </ul>
          </section>

          <!-- URL 显示 -->
          <section>
            <h3 class="text-xs uppercase tracking-widest text-[#6b6560] mb-2">链接</h3>
            <code class="block bg-[#0a0a0a] border border-[#2a2520] rounded px-3 py-2 text-[#c9a55c] text-sm break-all">
              {{ item.url }}
            </code>
          </section>
        </div>

        <!-- 底部按钮 -->
        <footer class="p-6 sm:p-8 pt-4 border-t border-[#2a2520] flex flex-col sm:flex-row gap-3">
          <a
            ref="enterBtnRef"
            :href="item.url" target="_blank" rel="noopener noreferrer"
            class="flex-1 text-center px-6 py-3 bg-[#d92020] hover:bg-[#b8181a] text-white font-semibold rounded-lg transition shadow-lg shadow-[#d92020]/20 focus:outline-none focus:ring-2 focus:ring-[#d92020] focus:ring-offset-2 focus:ring-offset-[#181818]"
          >
            进入 →
          </a>
          <button
            @click="copyUrl"
            class="px-6 py-3 bg-[#0a0a0a] border border-[#2a2520] hover:border-[#c9a55c] hover:text-[#c9a55c] text-[#9a9590] font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#c9a55c] focus:ring-offset-2 focus:ring-offset-[#181818]"
          >
            {{ copied ? '已复制 ✓' : '复制 URL' }}
          </button>
          <button
            @click="emit('close')"
            class="px-6 py-3 bg-transparent text-[#6b6560] hover:text-[#9a9590] font-medium rounded-lg transition focus:outline-none"
          >
            关闭
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>
