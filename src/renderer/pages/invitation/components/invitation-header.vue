<template>
  <main>
    <header class="flex-between">
      <h2>{{ $t('homeInvitation.hiTit') }}</h2>
      <button type="button" class="rules-btn" @click="shareMethod">{{ $t('homeInvitation.hiShare') }}</button>
    </header>

    <section class="header-list">
      <section class="header-img">
        <img :src="headerImg" alt="" />
      </section>
      
      <section class="header-text">
        <h3>{{ $t(headerLevel) }}</h3>
        <!-- <p class="header-txt">{{ $t(nextUpgrade) }}</p> -->
        <p class="look-list">
          <section class="progress-list clearfix">
            <el-progress :percentage="progressTxt" color="#29D893" /> 
            <span>{{ progress }} / {{ levelNumber }}</span>
          </section>
          <span @click="lookRules" class="rules-btn">{{ $t('homeInvitation.hiBtn') }}</span>
        </p>
      </section>
    </section>
    <section class="line"></section>

    <!-- 分享弹窗 -->
    <share-mask 
      :invitationCode="invitationCode"
      :sharePage="sharePage"
      v-show="shareShow"
      @close = 'closeMask'/>
  </main>
</template>

<script>
import level1 from '../../../assets/images/levels1.png'
import level2 from '../../../assets/images/levels2.png'
import level3 from '../../../assets/images/levels3.png'
import level4 from '../../../assets/images/levels4.png'

import shareMask from './invitation-share-mask'
const dataCenterHandler = require('../../../lib/DataCenterHandler')
export default {
  name: '',
  components: {
    shareMask
  },
  props: {
    level: Number,
    progress: Number,
    walletAddress: String,
    invitationCode: String
  },
  data() {
    return {
      level1,
      level2,
      level3,
      level4,
      shareShow: false,
      sharePage: 0, // 0 可以显示分享弹窗 1 提示开启冻结
    }
  },
  computed: {
    wallets () {
      return this.$store.getters.wallets
    },
    miningWallet () {
      return this.$store.getters.miningWallet
    },
    //返回当前 奖牌图片
    headerImg() {
      if (this.level == 1) {
        return level1
      } else if (this.level == 2) {
        return level2
      } else if (this.level == 3) {
        return level3
      } else {
        return level4
      }
    },

    //返回等级 合伙人
    headerLevel() {
      if (this.level === 1) {
        return 'homeInvitationMask.hiMaskRulesListLevel1'
      } else if (this.level === 2) {
        return 'homeInvitationMask.hiMaskRulesListLevel2'
      } else if (this.level === 3) {
        return 'homeInvitationMask.hiMaskRulesListLevel3'
      } else {
        return 'homeInvitationMask.hiMaskRulesListLevel4'
      }
    },

    //返回每个等级人数
    levelNumber() {
      if (this.level === 1) {
        return 9
      } else if (this.level === 2) {
        return 31
      } else if (this.level === 3) {
        return 63
      } else {
        return '64 +'
      }
    },

    //返回奖金等级
    nextUpgrade() {
      if (this.level === 1) {
        return 'homeInvitation.hiTxt1'
      } else if (this.level === 2) {
        return 'homeInvitation.hiTxt2'
      } else if (this.level === 3) {
        return 'homeInvitation.hiTxt2'
      } else {
        return 'homeInvitation.hiTxt3'
      }
    },

    //返回进度条
    progressTxt() {
      if (this.level === 1) {
        if (this.progress === 0) {
          return 0
        } else if (this.progress === 9) {
          return 100
        } else {
          for (var i = 0; i < 9; i++) {
            if (i === this.progress) {
              return (i + 1) * 10
            }
          }
        }
      } else if (this.level === 2) {
        if (this.progress === 10) {
          return 0
        } else if (this.progress === 31) {
          return 100
        } else {
          for (var i = 11; i < 31; i++) {
            if (i === this.progress) {
              return (i - 10) * 4.5
            }
          }
        }
      } else if (this.level === 3) {
        if (this.progress === 32) {
          return 0
        } else if (this.progress === 63) {
          return 100
        } else {
          for (var i = 33; i < 63; i++) {
            if (i === this.progress) {
              return (i - 32) * 3.2
            }
          }
        }
      } else {
        return 100
      }
    }
  },
  created() {

  },
  methods: {
    //查看规则
    lookRules() {
      this.$emit('rules')
    },

    closeMask() {
      this.shareShow = false
      this.sharePage = 0
    },

    //分享弹窗
    shareMethod() {
      /**
       * 判断是否有抵押
       * 0 有抵押  1 没有抵押
       * 
       */
      this.shareShow = true
      if (Number(this.miningWallet.mortgageValue) > 0) {
        this.sharePage = 0
      } else {
        this.sharePage = 1
      }
    }
  }
}
</script>

<style scoped>
main {
  padding-top: 20px;
}
header {
  padding: 0 32px;
}
header button {
  border: 0;
  margin-left: 0 !important;
}
.en header button {
  font-family: Source-Medium;
  font-size: 13px;
}
h2 {
  margin: 0;
  color: #252f33;
  font-size: 18px;
  font-family: Montserrat-SemiBold;
}
.en h2 {
  color: #576066;
  font-family: Source-Medium;
  font-weight: 500;
}

.header-list {
  display: flex;
  align-items: center;
  padding: 20px 32px 16px;
  height: 64px;
}

.header-img {
  width: 64px;
  height: 64px;
  background: #eef2f1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.header-text {
  flex: 1;
}
.header-text h3 {
  margin: 0;
  font-family: Lato-Bold;
}
.en .header-text h3 {
  font-family: Source-Medium;
  font-weight: 500;
  color: #576066;
}
.header-text .header-txt {
  padding-top: 6px;
}
.en .header-text .header-txt {
  color: #6d7880;
}

.look-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.rules-btn {
  width: 98px;
  height: 32px;
  background: #f7fbfa;
  border-radius: 4px;
  color: #29d893;
  text-align: center;
  line-height: 32px;
  margin-left: 28px;
  cursor: pointer;
}

.progress-list {
  flex: 1;
  height: 10px;
  line-height: 6px;
}
.progress-list span {
  float: left;
  vertical-align: middle;
  margin-left: 12px;
  color: #252f33;
  font-family: Lato-Medium;
}
.progress-list >>> .el-progress-bar {
  width: 94%;
  float: left;
  vertical-align: middle;
}
.progress-list >>> .el-progress__text {
  display: none !important;
}
.line {
  width: 100%;
  height: 6px;
  background: #f4f5f5;
}
</style>