export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const response = await fetch(
      'https://api.exchangerate.host/latest?base=CNY&symbols=MYR,SGD,THB'
    );
    const data = await response.json();
    
    res.status(200).json({
      success: true,
      rates: data.rates,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // 失败时返回备用数据
    res.status(200).json({
      success: false,
      rates: {
        MYR: 0.6482,
        SGD: 0.1852,
        THB: 4.4940
      },
      timestamp: new Date().toISOString(),
      note: 'fallback data'
    });
  }
}
