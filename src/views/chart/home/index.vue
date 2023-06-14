<template>
  <div>
    <div class="body">
      <div class="left" :style="isLeftShow ? 'width:320px' : 'width:0'">
        <el-tree
          :data="list"
          node-key="id"
          :props="{ children: 'children', label: 'topic' }"
          default-expand-all
          :expand-on-click-node="false"
        >
          <div slot-scope="{ data }">
            <div class="inpBox">
              <el-input
                size="mini"
                placeholder="请输入内容"
                v-model="data.topic"
              >
              </el-input>
              <i class="el-icon-circle-plus-outline" @click="add(data)"></i>
              <i
                v-show="data.$treeNodeId != 1"
                class="el-icon-remove-outline"
                @click="del(data)"
              ></i>
            </div>
          </div>
        </el-tree>
        <div class="leftBot">
          <el-button
            type="primary"
            icon="el-icon-download"
            style="width: 100%"
            @click="toLoad"
            :loading="loadLoading"
            >下载</el-button
          >
        </div>
      </div>
      <div
        class="right"
        :style="isLeftShow ? 'width:calc(100% - 320px)' : 'width:100%'"
      >
        <div id="map" ref="captureArea"></div>
        <div class="tip">
          <i
            @click="toLeftShow"
            :class="isLeftShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
export default {
  name: "chartHome",
  components: {},
  data() {
    return {
      list: [
        {
          topic: "",
          children: [],
        },
      ],
      loadLoading: false,
      isLeftShow: true,
    };
  },
  watch: {
    list: {
      handler(to, from) {
        if (to.length > 0) {
          let obj = new Object();
          this.toSetList(to);
          obj.nodeData = to[0];
          let mind = new MindElixirLite({ el: "#map" });
          mind.init(obj);
        }
      },
      deep: true,
    },
  },
  created() {
    let list = this.$unit.getLocalStorage("chartList");
    if (list) {
      this.list = JSON.parse(list);
    }
  },
  mounted() {
    let obj = new Object();
    obj.nodeData = this.list[0];
    let mind = new MindElixirLite({ el: "#map" });
    mind.init(obj);
  },
  methods: {
    add(data) {
      let id = data.$treeNodeId;
      let obj = findObjectWithPropertyValue(this.list, "$treeNodeId", id);
      obj.children.push({
        topic: "",
        children: [],
      });
      function findObjectWithPropertyValue(arr, key, value) {
        let result = null;
        for (const item of arr) {
          if (item[key] === value) {
            return item;
          }
          if (Array.isArray(item.children) && item.children.length > 0) {
            result = findObjectWithPropertyValue(item.children, key, value);
            if (result) {
              return result;
            }
          }
        }
        return result;
      }
    },
    del(data) {
      let id = data.$treeNodeId;
      removeObjectWithPropertyValue(this.list, "$treeNodeId", id);
      function removeObjectWithPropertyValue(arr, key, value) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][key] === value) {
            arr.splice(i, 1);
            return true;
          }
          if (Array.isArray(arr[i].children) && arr[i].children.length > 0) {
            const result = removeObjectWithPropertyValue(
              arr[i].children,
              key,
              value
            );
            if (result) {
              return true;
            }
          }
        }
        return false;
      }
    },
    async toLoad() {
      this.loadLoading = true;
      try {
        const canvas = await html2canvas(this.$refs.captureArea);
        canvas.toBlob((blob) => {
          saveAs(blob, "image.png");
          this.loadLoading = false;
          this.$message({
            message: "下载成功",
            type: "success",
          });
        });
      } catch (error) {
        this.loadLoading = false;
        console.error("下载图片失败:", error);
      }
    },
    toSetList(to) {
      function removeProperty(obj, prop) {
        for (var i in obj) {
          if (i == prop) {
            delete obj[i];
          } else if (typeof obj[i] == "object") {
            removeProperty(obj[i], prop);
          }
        }
      }
      for (var i = 0; i < to.length; i++) {
        removeProperty(to[i], "parent");
      }
      this.$unit.setLocalStorage("chartList", JSON.stringify(to));
    },
    toLeftShow() {
      this.isLeftShow = !this.isLeftShow;
    },
  },
};
</script>
<style lang="scss" scoped>
.body {
  display: flex;
  .left {
    transition: width 0.3s linear;
    width: 320px;
    height: 100vh;
    padding-top: 10px;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    /deep/ .el-tree-node__content {
      height: 38px;
    }
    /deep/ .el-tree-node > .el-tree-node__children {
      overflow: visible;
      background-color: transparent;
    }
    .inpBox {
      padding-right: 10px;
      i {
        margin-left: 5px;
      }
      /deep/ .el-input {
        width: 180px;
      }
    }
    .leftBot {
      padding: 10px;
    }
  }
  .right {
    width: calc(100% - 320px);
    transition: width 0.3s linear;
    height: 100vh;
    position: relative;
    #map {
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
    /deep/ .mind-elixir-toolbar {
      display: none;
    }
    .tip {
      position: absolute;
      display: none;
      bottom: 20px;
      left: 20px;
      background: #fff;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
      font-size: 15px;
    }
    &:hover {
      /deep/ .mind-elixir-toolbar {
        display: block;
      }
      .tip {
        display: block;
      }
    }
  }
}
</style>
