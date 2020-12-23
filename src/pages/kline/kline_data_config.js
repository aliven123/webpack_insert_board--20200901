const getRequestUrl=function(c_board){/* 根据模块接口切换函数 */
  const urlobj={
    stock:{/* 股票接口主图接口 */
      day_period:'get_history_data/',/*日线以上周期,含日线 */
      min_period:'get_history_data/',/* 分钟线 */
      fenshi:'history_mb_stocks_data/'/* 分时线 */
    },
    future:{/* 期货接口主图接口 */
      day_period:'get_history_data/',
      min_period:'get_history_data/',
      fenshi:'history_mb_future_data/'
    },
    arbitrage:{/* 套利接口主图接口 */
      day_period:'get_history_data/',
      min_period:'get_history_data/',
      fenshi:'spread/history_mb_spread_data/'
    },
    fund:{/* 基金接口主图接口 */
      day_period:'get_history_data/',
      min_period:'get_history_data/',
      fenshi:'history_mb_fund_data/'
    },
    bond:{/* 债券接口 */
      day_period:'get_history_data/',
      min_period:'get_history_data/',
      fenshi:'history_mb_bond_data/'
    },
    group:{/* 篮子组合接口主图接口 */
      day_period:'get_history_data/',
      min_period:'get_history_data/',
      fenshi:'history_mb_index_data/'
    },
    stock_index:{/*指数接口主图接口 */
      day_period:'get_history_data/',
      min_period:'get_history_data/',
      fenshi:'history_mb_index_data/'
    },
    optional:{/* 自选接口主图接口按类型区分 */
      day_period:'get_history_data/',
      min_period:'get_history_data/',
      fenshi:'history_mb_stocks_data/'
    }
  };
  return urlobj[c_board]
};
export default{
  getRequestUrl
}
