<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <!-- 
      这个if条件在判断当前的item数据下有没有children属性,且children是不是仅有一个成员
      当满足以上条件渲染v-if中的内容
        onlyOneChild就是有且就有一个的子路由,就是 home 这个子路由
      当item数据中的children有多个成员的时候,会走 v-else
        v-else 中发现了有 <sidebar-item></sidebar-item> 组件,自己调用自己,递归组件
      
      这里每一个 sidebar-item 都是一个渲染的菜单栏
     -->
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" 
            :title="!appStore.sidebar.opened && !isNest ? '' : onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenuRef" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item :icon="item.meta.icon || (item.meta && item.meta.icon)" 
            :title="!appStore.sidebar.opened && !isNest ? '' : item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        is-nest
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SidebarItem'
  }
</script>

<script lang="ts" setup>
  // import path from 'path'
  import path from 'path-browserify'
  import { isExternalFn } from '@/utils/validate'
  import Item from './Item.vue'
  import AppLink from './Link.vue'
  import FixiOSBug from './FixiOSBug'
  import type { ElSubMenu } from 'element-plus'
  import { ref } from 'vue'
  import { useAppStore } from "@/stores/app";

  const appStore = useAppStore();

  const subMenuRef = ref<InstanceType<typeof ElSubMenu>>()

  FixiOSBug(subMenuRef)

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  })
  // console.log('循环渲染的数据 route', props.item);

  const onlyOneChild = ref<any>({})

  const hasOneShowingChild = (children = [], parent: any) => {
    const showingChildren = children.filter((item: any) => {
      if (item.meta.hidden) {
        return false
      } else {
        // Temp set(will be used if only has one showing child)
        onlyOneChild.value = item
        return true
      }
    })

    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1) {
      return true
    }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
      onlyOneChild.value = { ... parent, path: '', noShowingChildren: true }
      return true
    }

    return false
  }

  const resolvePath = (routePath: string) => {
    if (isExternalFn(routePath)) {
      return routePath
    }
    if (isExternalFn(props.basePath)) {
      return props.basePath
    }
    return path.resolve(props.basePath, routePath)
  }

</script>
