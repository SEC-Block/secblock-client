<template>
  <main>
    <section class="dig-more-container">
      <!-- 头部 -->
      <section class="dig-more-header">
        <img src="../../assets/images/returnImg.png" @click="returnDig" title="return"/>
        <section class="dig-more-header-title">
          <section>
            <p>{{ $t('homeDigMore.hdmTit1') }}</p>
            <p>{{selectedWallet.walletName}}</p>
          </section>
          <section>
            <p>{{ $t('homeDigMore.hdmTit2') }}</p>
            <p>0x{{selectedWallet.walletAddress}}</p>
          </section>
        </section>
      </section>

      <!-- 内容 -->
      <section class="dig-more-body" :class="loadMore?'dig-body-padding-bottom':''">
          
          <section class="dig-body-title">
            <h3>{{ $t('homeDig.hdNavProfitListTit1') }}</h3>
            <section class="dig-body-title-list">
              <section>
                <span></span>
                <span>{{ $t('homeDig.hdNavProfitListTit2') }}：</span>
                <span>{{ this.digNumber}}</span>
              </section>
              <section>
                <span></span>
                <span>{{ $t('homeDig.hdNavProfitListTit3') }}：</span>
                <span>{{ getPointNum(this.digIncome) }} BIU</span>
              </section>
            </section>
          </section>

        <section class="dig-more-lists">
          <dig-list :moreList="moreList"/>
        </section>

        <p v-show="loadMore" class="load-more" @click="onClickLoadMore">{{ $t('page.clickMore') }}</p>
      </section>
    </section>
  </main>
</template>

<script>
import digList from './components/wallet-dig-more-list'
let updateListJob
export default {
  name: '',
  components: {
    digList
  },
  props: {},
  data () {
    return {
      loadMore: false, //加载更多按钮
      wallets: {},
      // moreList: [],
      // moreListSkip: 7,
      updateListJob: ''
    }
  },
  computed: {
    selectedWallet () {
      return this.$store.getters.miningWallet
    },
    digNumber () {
      return this.$store.getters.miningWalletDigNumber
    },
    digIncome () {
      return this.$store.getters.miningWalletDigIncome
    },
    moreListSkip () {
      return this.$store.getters.miningWalletPageSize
    },
    moreList () {
      return this.$store.getters.miningWalletHistoryAll
    }
  },
  created () {
    //console.log(this.wallets.length)
    this._startUpdateHisotryJob()
  },
  mounted () {

  },
  destroyed () {
    if (updateListJob) {
      clearInterval(updateListJob)
    }
  },
  methods: {
    onClickLoadMore () {
      this.$store.commit('updateMiningListPageSize', {
        privateKey: this.selectedWallet.privateKey,
        pageSize: this.moreListSkip + 10
      })
      // this.moreListSkip = this.moreListSkip + 10
      if (updateListJob) {
        clearInterval(updateListJob)
      }
      this._startUpdateHisotryJob()
    },

    getMiningList () {
      // 获取挖矿交易历史
      this.$JsonRPCClient.getMiningTransactions([this.selectedWallet.walletAddress, 1, this.moreListSkip], (history) => {
        let moreList = []
        if (this.moreListSkip === history.length) {
          this.loadMore = true
        } else {
          this.loadMore = false
        }
        for (let item of history) {
          let moneyValue = item.listMoney.length > 10 && item.listMoney.indexOf('.') > 0 ? this.getPointNum (item.listMoney, 8) : item.listMoney
          moreList.push({
            id: 0,
            age: item.listTime,
            reward: `${moneyValue} BIU`,
            blocknumber: item.blockNumber,
            blockhash: item.blockHash
          })
        }
        this.$store.commit('updateMiningHistoryAll', {
          privateKey: this.selectedWallet.privateKey,
          miningHistory: moreList
        })
      })

      // 获取挖矿交易数量 和 挖矿总收益

      this.$JsonRPCClient.getMiningTotalReward(this.selectedWallet.walletAddress, (reward) => {
        let digNumber = reward.rewardsum
        let digIncome = reward.miningreward
        this.$store.commit('updateMiningAmount', {
          privateKey: this.selectedWallet.privateKey,
          digNumber: digNumber,
          digIncome: digIncome.toString()
        })
      })

      // this.$JsonRPCClient.getMiningTransactions([this.selectedWallet.walletAddress], (history) => {
      //   let digIncome = 0
      //   history.forEach(item => {
      //     let moneyValue = item.listMoney.length > 10 && item.listMoney.indexOf('.') > 0 ? this.getPointNum(item.listMoney, 8) : item.listMoney
      //     digIncome = digIncome + Number(moneyValue)
      //   })
      //   this.$store.commit('updateMiningAmount', {
      //     privateKey: this.selectedWallet.privateKey,
      //     digNumber: history.length,
      //     digIncome: digIncome.toString()
      //   })
      // })
    },

    _startUpdateHisotryJob () {
      if (updateListJob) {
        clearInterval(updateListJob)
      }
      this.getMiningList()
      updateListJob = setInterval(this.getMiningList, 3 * 60 * 1000)
    },

    //返回挖矿页面
    returnDig () {
      this.$router.push({ path: '/walletDig', query: {wallets: this.wallets, selectedPrivateKey: this.selectedPrivateKey, firstKey: this.selectedPrivateKey} })
    }
  },
}
</script>

<style scoped>
  main {padding: 24px;background: #F4F5F5;height: calc(100vh - 48px);display: flex;
    align-content: stretch;display:-webkit-flex;}
  .dig-more-container {display: flex;flex-direction: column;box-shadow:0px 0px 3px rgba(0,0,0,0.16);
    border-radius:4px;flex: 1;}

  .dig-more-header {height: 102px;border-bottom:1px solid rgba(229,229,229,1);background: #fff;
    border-top-left-radius: 4px;border-top-right-radius: 4px;}
  .dig-more-header img {width: 24px;height: 24px;margin: 7px 0 14px 12px;}
  .dig-more-header .dig-more-header-title {display: flex;padding-left: 32px;color: #839299;}
  .dig-more-header .dig-more-header-title section p:last-child {color: #252F33;font-weight: 500;
    font-size: 14px;padding-top: 6px;font-family: Lato-Medium;}
  .dig-more-header .dig-more-header-title section:last-child {padding-left: 203px;}


  .dig-more-body {background: #fff;padding-top: 36px;border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;flex: 1;}

  .dig-more-lists {flex: 1;}
  
  
  .dig-more-body-header {position: fixed;top: 157px;left: 126px;right: 56px;background: #fff;
    padding: 36px 0 13px;}
  .dig-more-body p {height: 40px;text-align: center;line-height: 40px;color: #839299;font-weight: 400;
    position: fixed;bottom: 24px;left: 94px;right: 24px;background: #fff;border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;}
  .dig-body-padding-bottom {padding-bottom: 0px;}

  .load-more:hover {cursor: pointer;}


  .dig-body-title {margin: 0 32px;padding-bottom: 13px;} 
  .dig-body-title,.dig-body-title .dig-body-title-list {display: flex;justify-content: space-between;align-items: center;}
  .dig-body-title h3 {margin: 0;font-size: 14px;color: #839299;font-family: Montserrat-SemiBold;font-weight: 600;}
  .dig-body-title .dig-body-title-list section {color: #839299;font-family: Montserrat-Light;}
  .dig-body-title .dig-body-title-list section span:first-child {display: inline-block;width:6px;height:6px;
    background:rgba(245,166,35,1);border-radius:50%;margin-right: 10px;}
  .dig-body-title .dig-body-title-list section span:last-child {color: #252F33;font-family: Lato-Medium;}
  .dig-body-title .dig-body-title-list section:nth-of-type(even) span:first-child {background:#388ED9;margin-left: 40px;}
  .dig-body-title .dig-body-title-list .dig-more {width:48px;height:24px;background:rgba(255,255,255,1);
    box-shadow:0px 0px 2px rgba(0,0,0,0.16);border-radius:2px;text-align: center;line-height: 24px;
    color: #29D893;font-weight: 400;margin-left: 50px;}
</style>