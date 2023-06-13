<template>
  <div>
    <div class="body">
      <div class="left">
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
      </div>
      <div class="right">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import "@/assets/js/flowchart.min.js";
export default {
  name: "chartHome",
  components: {},
  data() {
    return {
      list: [
        {
          topic: "网创",
          children: [],
        },
      ],
    };
  },
  watch: {
    list: {
      handler(to, from) {
        if (to.length > 0) {
          let obj = new Object();
          obj.nodeData = to[0];
          let mind = new MindElixirLite({ el: "#map" });
          mind.init(obj);
        }
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    let obj = new Object();
    obj.nodeData = this.list[0];
    let mind = new MindElixirLite({ el: "#map" });
    mind.init(obj);
  },
  methods: {
    add(data) {
      let id = data.$treeNodeId;
      this.getIdObj(this.list, id, 1, 0);
    },
    del(data) {
      let id = data.$treeNodeId;
      this.getIdObj(this.list, id, 2, 0);
    },
    getIdObj(arr, id, type, arrIndex) {
      console.log(arr, id, type, arrIndex);
      if (id == arr[arrIndex].$treeNodeId) {
        console.log(arr, id, type, arrIndex);
        if (type == 1) {
          arr[arrIndex].children.push({
            topic: "",
            children: [],
          });
        } else if (type == 2) {
          arr.splice(arrIndex, 1);
        }
      } else {
        console.log(arrIndex, 888, arr.length);
        if (arrIndex == arr.length - 1) {
          arrIndex = 0;
          this.getIdObj(arr[arrIndex].children, id, type, arrIndex);
        } else {
          arrIndex++;
          this.getIdObj(arr, id, type, arrIndex);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.body {
  display: flex;
  .left {
    width: 320px;
    height: 100vh;
    padding-top: 10px;

    overflow: auto;
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
  }
  .right {
    width: calc(100% - 320px);
    height: 100vh;
    #map {
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
  }
}
</style>
