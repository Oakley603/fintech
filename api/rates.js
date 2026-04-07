module.exports = async function (req, res) {
    const API_KEY = process.env.FIXER_API_KEY;
    
    try {
        const response = await fetch(
            `http://data.fixer.io/api/latest?access_key=${API_KEY}&symbols=CNY,MYR,SGD,THB`
        );
        const data = await response.json();
        
        // 成功时返回数据
        res.status(200).json(data);
    } catch (error) {
        // 失败时返回报错，防止页面卡死
        res.status(500).json({ success: false, message: "Fetch failed" });
    }
};
