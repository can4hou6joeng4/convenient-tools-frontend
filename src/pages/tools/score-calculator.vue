<template>
  <view class="container">
    <!-- 主要内容卡片 -->
    <view class="score-card">
      <!-- 表格布局 -->
      <view class="score-table">
        <!-- 玩家区域 -->
        <view class="table-row">
          <view class="player-label">
            <text class="player-text">玩家</text>
            <text class="score-text">积分</text>
          </view>
          <view class="player-column">
            <!-- 表情行 -->
            <view class="emoji-row">
              <view v-for="(player, idx) in players" :key="'emo-'+idx" class="emoji-cell">
                <input
                  type="text"
                  :value="player.emoji"
                  class="emoji-input"
                  :data-idx="idx"
                  @input="handleEmojiInput"
                  maxlength="2"
                />
              </view>
            </view>
            
            <!-- 积分输入行 -->
            <view class="score-row">
              <view v-for="(player, idx) in players" :key="'si-'+idx" class="score-input-cell">
                <input 
                  type="text"
                  :value="player.scoreInput" 
                  placeholder="以','分割"
                  class="scores-input"
                  :data-idx="idx"
                  @input="handleScoreInput"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 轮次显示 -->
      <view v-if="maxRounds > 0" class="rounds-section">
        <view class="round-header">轮次得分详情</view>
        
        <view v-for="round in maxRounds" :key="'rd-'+round" class="round-row">
          <view class="round-label">
            <text>第</text>
            <text class="round-num">{{ round }}</text>
            <text>轮</text>
          </view>
          <view v-for="(player, pIdx) in players" :key="'sc-'+pIdx+'-'+round" class="round-score-cell">
            <text>{{ getPlayerRoundScore(pIdx, round-1) }}</text>
          </view>
        </view>
      </view>
      
      <!-- 总得分行 - 始终显示 -->
      <view v-if="maxRounds > 0" class="footer-row">
        <view class="total-label">总得分</view>
        <view v-for="(total, idx) in totalScores" :key="'raw-'+idx" class="total-cell">
          <text>{{ total }}</text>
        </view>
      </view>
      
      <!-- 新增合计行 - 在应用积分比例后显示 -->
      <view v-if="hasAppliedRatio" class="footer-row">
        <view class="total-label final">合计</view>
        <view v-for="(score, idx) in diffResults" :key="'fin-'+idx" class="total-cell final">
          <text :class="{'positive': score > 0, 'negative': score < 0}">{{ formatDiff(score) }}</text>
        </view>
      </view>
      
      <!-- 修改为盈亏行 - 仅在应用积分比例后显示 -->
      <view v-if="hasAppliedRatio" class="footer-row">
        <view class="total-label final profit-loss">盈亏</view>
        <view v-for="(score, idx) in finalScores" :key="'tot-'+idx" class="total-cell final">
          <text :class="{'positive': score > 0, 'negative': score < 0}">
            {{ formatDiff(score) }}
          </text>
        </view>
      </view>
      
      <!-- 积分比例单独一行 -->
      <view v-if="hasAppliedRatio" class="footer-row ratio-row">
        <view class="ratio-display full-width">
          <text>积分比例: {{ scoreRatio }}</text>
        </view>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn reset-btn" @tap="resetScores">
        <text>重置积分</text>
      </button>
      
      <button class="action-btn ratio-btn" @tap="showRatioInput">
        <text>积分比例</text>
      </button>
    </view>
    
    <!-- 更新使用说明 -->
    <view class="help-section">
      <text class="section-title">使用说明</text>
      <view class="help-list">
        <view class="help-item">
          <text class="help-text">• 在上方标识区域输入最多2个字符标识玩家</text>
        </view>
        <view class="help-item">
          <text class="help-text">• 在分数输入框中输入用逗号分隔的数字，如"5,3,10"</text>
        </view>
        <view class="help-item">
          <text class="help-text">• 点击"积分比例"按钮输入比例系数计算结果</text>
        </view>
      </view>
    </view>
    
    <!-- 积分比例弹窗 -->
    <view v-if="showRatio" class="modal-mask" @tap.stop="showRatio = false">
      <view class="ratio-modal" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">积分比例</text>
          <text class="modal-close" @tap="showRatio = false">×</text>
        </view>
        
        <view class="ratio-content">
          <view class="ratio-input-row">
            <text class="ratio-label">请输入积分比例：</text>
            <input 
              type="digit"
              :value="ratioValue" 
              placeholder="如：0.2"
              class="ratio-input"
              @input="handleRatioInput"
            />
          </view>
          
          <button class="ratio-confirm-btn" @tap="applyRatio">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      defaultEmojis: ['🙂', '😀', '😊', '👍'],
      playerCount: 4,
      players: [],
      showRatio: false,
      isReady: false,
      ratioValue: "", // 移除默认值，只使用placeholder
      scoreRatio: 0,
      hasAppliedRatio: false // 是否已应用积分比例
    };
  },
  created() {
    try {
      // 初始化玩家数据
      this.players = Array.from({ length: this.playerCount }, (_, i) => ({
        emoji: this.defaultEmojis[i] || '😄',
        scores: [],
        scoreInput: ''
      }));
    } catch (error) {
      console.error('组件初始化出错:', error);
    }
  },
  // 小程序特有生命周期，在组件完全准备好后调用
  onReady() {
    try {
      console.log('组件已准备就绪');
      this.isReady = true;
    } catch (error) {
      console.error('组件Ready事件处理出错:', error);
    }
  },
  computed: {
    maxRounds() {
      if (!this.players || this.players.length === 0) return 0;
      
      // 找出包含最多轮次的玩家
      return Math.max(...this.players.map(p => p.scores.length));
    },
    totalScores() {
      return this.players.map(p => 
        p.scores.reduce((a, b) => a + b, 0)
      );
    },
    // 计算分差总和
    diffResults() {
      try {
        const results = [];
        const totals = this.totalScores;
        
        // 遍历所有玩家
        for (let i = 0; i < this.players.length; i++) {
          // 当前玩家的总得分
          const currentScore = totals[i];
          let diffSum = 0;
          
          // 计算当前玩家与其他所有玩家的分差总和
          for (let j = 0; j < totals.length; j++) {
            if (i !== j) {
              // 其他玩家分数 - 当前玩家分数 (修正方向)
              diffSum += (totals[j] - currentScore);
            }
          }
          
          results.push(diffSum);
        }
        
        return results;
      } catch (error) {
        console.error('计算分差总和出错:', error);
        return [];
      }
    },
    // 盈亏分数 = 分差总和 * 积分比例
    finalScores() {
      try {
        return this.diffResults.map(result => 
          Math.round(result * this.scoreRatio)
        );
      } catch (error) {
        console.error('计算最终得分出错:', error);
        return [];
      }
    },
    // 新增：计算最终合计得分 = 总得分 + 盈亏
    calculatedFinalScores() {
      try {
        const totals = this.totalScores;
        const profits = this.finalScores;
        
        return totals.map((total, idx) => total + (profits[idx] || 0));
      } catch (error) {
        console.error('计算合计得分出错:', error);
        return [];
      }
    }
  },
  methods: {
    // 处理表情/昵称输入
    handleEmojiInput(e) {
      try {
        const idx = e.currentTarget.dataset.idx;
        let value = e.detail.value;
        
        // 限制为最多两个字符
        if (value.length > 2) {
          // 提取前两个字符
          value = Array.from(value).slice(0, 2).join('');
        }
        
        // 更新玩家表情/昵称
        if (this.players && this.players[idx]) {
          this.players[idx].emoji = value;
        }
      } catch (error) {
        console.error('处理表情输入出错:', error);
      }
    },
    
    // 处理积分输入
    handleScoreInput(e) {
      try {
        const idx = e.currentTarget.dataset.idx;
        let value = e.detail.value;
        
        // 自动将中文逗号替换为英文逗号
        if (value.includes('，')) {
          value = value.replace(/，/g, ',');
          
          // 手动更新输入框的值
          setTimeout(() => {
            if (this.players && this.players[idx]) {
              this.players[idx].scoreInput = value;
            }
          }, 0);
        }
        
        // 更新输入值
        if (this.players && this.players[idx]) {
          this.players[idx].scoreInput = value;
          this.parseScores(idx);
        }
      } catch (error) {
        console.error('处理输入出错:', error);
      }
    },
    
    // 解析用户输入的分数字符串
    parseScores(playerIdx) {
      try {
        const player = this.players[playerIdx];
        if (!player) return;
        
        let scoreText = player.scoreInput;
        
        // 使用逗号分隔分数，支持中文逗号"，"
        if (scoreText) {
          // 将中文逗号替换为英文逗号
          scoreText = scoreText.replace(/，/g, ',');
          
          const scoreValues = scoreText.split(',').map(s => {
            const num = parseInt(s.trim(), 10);
            return isNaN(num) ? 0 : num;
          });
          
          // 更新玩家分数
          player.scores = scoreValues;
        } else {
          player.scores = [];
        }
      } catch (error) {
        console.error('解析积分出错:', error);
      }
    },
    
    // 获取指定玩家特定轮次的得分
    getPlayerRoundScore(playerIdx, roundIdx) {
      try {
        const player = this.players[playerIdx];
        if (!player || !player.scores || roundIdx >= player.scores.length) {
          return 0;
        }
        return player.scores[roundIdx];
      } catch (error) {
        console.error('获取轮次积分出错:', error);
        return 0;
      }
    },
    
    // 重置积分
    resetScores() {
      try {
        uni.showModal({
          title: '提示',
          content: '确定要重置所有积分吗？',
          success: (res) => {
            if (res.confirm) {
              this.players.forEach(p => {
                p.scores = [];
                p.scoreInput = '';
              });
              // 重置积分比例相关状态
              this.hasAppliedRatio = false;
              this.scoreRatio = 0;
              this.ratioValue = "";
              
              uni.showToast({
                title: '已重置',
                icon: 'success',
                duration: 1500
              });
            }
          }
        });
      } catch (error) {
        console.error('重置积分出错:', error);
      }
    },
    
    // 显示积分比例输入弹窗
    showRatioInput() {
      this.showRatio = true;
    },
    
    // 处理积分比例输入
    handleRatioInput(e) {
      try {
        const value = e.detail.value;
        this.ratioValue = value;
      } catch (error) {
        console.error('处理比例输入出错:', error);
      }
    },
    
    // 应用积分比例
    applyRatio() {
      try {
        const ratio = parseFloat(this.ratioValue);
        if (!isNaN(ratio)) {
          this.scoreRatio = ratio;
          this.hasAppliedRatio = true;
          this.showRatio = false;
          
          // 移除确认提示
        } else {
          uni.showToast({
            title: '请输入有效比例',
            icon: 'none',
            duration: 1500
          });
        }
      } catch (error) {
        console.error('应用比例出错:', error);
      }
    },
    
    // 格式化分差显示
    formatDiff(diff) {
      if (diff > 0) {
        return `+${diff}`;
      }
      return diff.toString();
    }
  }
};
</script>

<style>
page {
  background-color: #f5f5f5;
}

.container {
  padding: 30rpx 20rpx;
  box-sizing: border-box;
  max-width: 98%;
  margin: 0 auto;
}

/* 积分卡片 */
.score-card {
  background-color: #ffffff;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

/* 表格布局 */
.score-table {
  margin-bottom: 20rpx;
}

.table-row {
  display: flex;
  width: 100%;
}

.player-label {
  width: 100rpx;
  background-color: #f0f0f0;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  height: 260rpx; /* 与右侧总高度一致 */
  border-radius: 12rpx;
  position: relative;
  overflow: hidden;
  margin-right: 10rpx;
}

.player-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.player-text, .score-text {
  position: absolute;
  font-size: 28rpx;
  z-index: 2;
  font-weight: 500;
}

.player-text {
  top: 35%;
  left: 40%;
  transform: translate(-50%, -50%);
}

.score-text {
  bottom: 35%;
  right: 40%;
  transform: translate(50%, 50%);
}

.player-label::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right bottom, transparent 49%, #ddd 49%, #ddd 51%, transparent 51%);
  z-index: 1;
}

.emoji-row {
  display: flex;
  margin-bottom: 20rpx;
  height: 150rpx;
}

.emoji-cell {
  flex: 1;
  background-color: #f5f5f5;
  font-size: 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
  height: 100%;
}

.emoji-input {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 48rpx;
  background-color: transparent;
  border: none;
  outline: none;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-row {
  display: flex;
  height: 90rpx;
}

.score-input-cell {
  flex: 1;
  background-color: #fff;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  margin-right: 10rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scores-input {
  width: 100%;
  height: 90%;
  text-align: center;
  font-size: 24rpx;
  color: #333;
  background-color: transparent;
  padding: 10rpx;
  box-sizing: border-box;
  position: relative;
  text-align-last: center;
  cursor: text;
}

/* 原有布局，保持不变 */
.cell {
  flex: 1;
  min-height: 80rpx;
  border-radius: 12rpx;
  margin-right: 10rpx;
  padding: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

.footer-row {
  display: flex;
  width: 100%;
  margin-bottom: 20rpx;
}

.round-label {
  width: 100rpx; /* 与玩家/积分标签宽度一致 */
  background-color: #f0f0f0;
  font-size: 28rpx;
  color: #333;
  white-space: nowrap;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
}

.round-num {
  display: inline-block;
  background-color: #4a90e2;
  color: white;
  border-radius: 8rpx;
  padding: 0 10rpx;
  margin: 0 6rpx;
  font-size: 24rpx;
  font-weight: bold;
}

.total-label {
  width: 100rpx; /* 与玩家/积分标签宽度一致 */
  min-height: 80rpx;
  background-color: #f0f0f0;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  border-radius: 12rpx;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.total-cell {
  flex: 1;
  background-color: #e9f1fb;
  font-size: 32rpx;
  font-weight: bold;
  color: #4a90e2;
  border-radius: 12rpx;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
}

/* 合计行样式 */
.total-label.final {
  background-color: #e6f7ff;
  color: #0056b3;
}

/* 盈亏行样式 */
.total-label.profit-loss {
  background-color: #f0f7ff;
  color: #0056b3;
}

.total-cell.final {
  background-color: #f0f8ff;
}

.round-score-cell {
  flex: 1;
  background-color: #f5f5f5;
  font-size: 30rpx;
  color: #333;
  border-radius: 12rpx;
  margin-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;
}

.action-btn {
  width: 45%;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  text-align: center;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #ff6b6b;
  border: 1rpx solid #ff6b6b;
}

.ratio-btn {
  background-color: #4a90e2;
  color: #ffffff;
}

/* 使用说明 */
.help-section {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 20rpx;
}

.help-list {
  margin-bottom: 20rpx;
}

.help-item {
  margin-bottom: 15rpx;
}

.help-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}

/* 积分比例弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.ratio-modal {
  width: 80%;
  background-color: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
  line-height: 1;
}

.ratio-content {
  padding: 30rpx;
}

.ratio-input-row {
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.ratio-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.ratio-input {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.ratio-confirm-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  text-align: center;
  background-color: #4a90e2;
  color: #ffffff;
  margin-bottom: 30rpx;
  border: none;
}

.ratio-display {
  background-color: #f0f0f0;
  padding: 0 20rpx;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #333;
  display: flex;
  align-items: center;
  height: 80rpx;
}

.full-width {
  width: 100%;
  justify-content: center;
}

.ratio-row {
  margin-top: 10rpx;
}

/* 轮次展示 */
.rounds-section {
  margin-top: 20rpx;
  margin-bottom: 30rpx;
  border-top: 1rpx solid #eee;
  padding-top: 20rpx;
}

.round-header {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  text-align: center;
}

.round-row {
  display: flex;
  width: 100%;
  margin-bottom: 14rpx;
}

.positive {
  color: #28a745;
}

.negative {
  color: #dc3545;
}
</style>
