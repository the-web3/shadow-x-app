import $ajax from "../common/request";

//获取行情列表
export const getMarketPrice = (params: any) => {
	return $ajax.post({
		url: 'api/get_exchange_market',
		data: params
  })
}

export const getExchanges = (data: any) => {
	return $ajax.post({
		url: 'api/get_exchanges',
		data
	})
}