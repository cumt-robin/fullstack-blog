module.exports = {
    // 查询所有
    GetAllBanners: 'SELECT * FROM banner',
    GetPcBanners: 'SELECT * FROM banner where type = 1',
    GetWeappBanners: 'SELECT * FROM banner where type = 2',
}
