CREATE TABLE customer (
    cust_id SERIAL PRIMARY KEY,
    cust_name TEXT NOT NULL,
    id CHARACTER(18), -- 身份证号
    cust_birth TIMESTAMPTZ,
    cust_gender SMALLINT,
    cust_phone TEXT UNIQUE NOT NULL,
    cust_email TEXT,
    cust_account TEXT,
    cust_password TEXT NOT NULL
);

CREATE TABLE shop (
    shop_id SERIAL PRIMARY KEY,
    shop_name TEXT NOT NULL,
    shop_password TEXT NOT NULL,
    shop_location TEXT,
    shop_phone TEXT UNIQUE NOT NULL,
    delivery_range TEXT,
    business_status SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE courier (
    cour_id SERIAL PRIMARY KEY,
    cour_name TEXT NOT NULL,
    cour_password TEXT NOT NULL,
    cour_phone TEXT UNIQUE NOT NULL,
    cour_living TEXT, -- 家庭地址
    cour_onboarding_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cour_temperature REAL,
    cour_COVID TIMESTAMPTZ
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    cust_id INTEGER NOT NULL REFERENCES customer,
    shop_id INTEGER NOT NULL REFERENCES shop,
    cour_id INTEGER REFERENCES courier,
    order_begin_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    order_state SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE dish (
    dish_id SERIAL PRIMARY KEY,
    shop_id INTEGER NOT NULL REFERENCES shop,
    dish_name TEXT NOT NULL,
    dish_value INTEGER NOT NULL,
    dish_score INTEGER,
    dish_sales INTEGER NOT NULL DEFAULT 0
);

-- 订单内所包含的菜品
CREATE TABLE contain (
    dish_id INTEGER REFERENCES dish,
    order_id INTEGER REFERENCES orders,
    contain_num INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (dish_id, order_id)
);

CREATE TABLE shopping_car (
    dish_id INTEGER REFERENCES dish,
    cust_id INTEGER REFERENCES customer,
    car_num INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (dish_id, cust_id)
);
INSERT INTO customer (cust_name, id, cust_birth, cust_gender, cust_phone, cust_email, cust_account, cust_password) VALUES
    ('朱皓轩', '371525199702079783', TIMESTAMP '1997-02-07 03:53:52', 1, '14762083431', 'haoxuan2@hotmail.com', 'zhu_haoxuan33', '0514dab5bf520ab10baec53e5f237be5'), -- 3_eNt_OYVUYvNAP
    ('钟离鑫鹏', '430600195507141073', TIMESTAMP '1955-07-14 02:23:38', 0, '097-69269324', 'lixinpeng6@yahoo.com', 'zhong1', 'd8207537f0bcea84e4aa8dd26b496fd0'), -- Xg926NJj3x1hhVd
    ('阎鹭洋', '610422196411174183', TIMESTAMP '1964-11-17 06:51:38', 1, '12357388838', 'luyang_yan@yahoo.com', 'yan36', '2a2adcf1e4022bf7fdfc1074301839fa'), -- bh8FtwKUbmVRDey
    ('徐智渊', '532327200202109138', TIMESTAMP '2002-02-10 05:37:01', 0, '0663-83451300', 'zhiyuan44@yahoo.com', 'xu_zhiyuan', '402b28026641d36fdb9f493a9ac9375a'), -- QibG0nRlA42cPRT
    ('姚志强', '120116195303308155', TIMESTAMP '1953-03-30 11:11:37', 0, '050-80116637', 'zhiqiang_yao@gmail.com', 'yao_zhiqiang', '98b7d43be68954518537e4c326d5991b'), -- d6ynMrKXqxyhBC5
    ('秦耀杰', '630225199303025837', TIMESTAMP '1993-03-02 08:01:16', 0, '14741426686', 'yaojie_qin@yahoo.com', 'qin27', '02c6238a175434aba453db276e2c1e86'), -- eya7L4xM9pcWhcT
    ('郑鹤轩', '140430195105118143', TIMESTAMP '1951-05-11 05:08:41', 1, '0778-25769024', 'hexuan_zheng36@yahoo.com', 'zheng.hexuan', 'a8760582578d6ef9b8ec94c806b75c97'), -- tTPDP_CB6JFHAOx
    ('曹子骞', '510504197104077298', TIMESTAMP '1971-04-07 02:01:46', 0, '0700-15768232', 'ziqian.cao39@gmail.com', 'cao31', '2e276d48a9642b114e6bf1e9d583767e'), -- tfh9FN62sLmpRg9
    ('于浩然', '321324197809073712', TIMESTAMP '1978-09-07 04:46:16', 0, '0732-12884738', 'haoran69@gmail.com', 'yu.haoran', 'c86c1f1431e59ae15f5ad522e47b8dc2'), -- SAG_LoUQb7LrSIc
    ('萧健雄', '321322197409085006', TIMESTAMP '1974-09-08 08:31:27', 1, '16931868166', 'jianxiong_xiao@yahoo.com', 'xiao41', '7de747a3951957e83df9b37bf0451de9'), -- 2WnMMcGOJATixYg
    ('夏天翊', '621225198601167117', TIMESTAMP '1986-01-16 03:38:50', 0, '0765-23108843', 'tianyi.xia97@gmail.com', 'xia.tianyi24', 'bc418df72befc865fee42c1dbb3f72b6'), -- Xtl3DYnTjbWS7vs
    ('邓烨霖', '210804199607204597', TIMESTAMP '1996-07-20 01:15:32', 0, '016-84215777', 'yelin.deng@hotmail.com', 'deng_yelin67', '162b1c30deaecfc07e6e57d7e9f7c30d'), -- qY6eAUbIBKvAVWi
    ('史浩宇', '370285199406097156', TIMESTAMP '1994-06-09 10:57:40', 0, '025-42776570', 'haoyu_shi9@yahoo.com', 'shi.haoyu', '4a0ff19353aa35ad71b6d2a00b4294d6'), -- blUdSYZ1FA24pr_
    ('陆驰', '44188219450127279X', TIMESTAMP '1945-01-27 07:46:29', 0, '0324-97980758', 'chi_lu@gmail.com', 'lu.chi', '1e8547830b3f9789b94c722d20654492'), -- 62ftRbiXjUMmM_t
    ('邹立轩', '632324197211281692', TIMESTAMP '1972-11-28 07:14:50', 0, '14121966694', 'lixuan.zou18@hotmail.com', 'zou15', 'c878d3c780eb9003e58c65fb4b763ff6'), -- Jn5iOi7zUkDXg4n
    ('司马嘉熙', '411301194710073547', TIMESTAMP '1947-10-07 05:44:38', 1, '15919464931', 'majiaxi59@hotmail.com', 'si49', '5dc3932c5f1c55b6a53c6aab5aa92687'), -- NJl10ZHG5LAqTLr
    ('范睿渊', '350824199308199169', TIMESTAMP '1993-08-19 06:07:16', 1, '019-68535718', 'ruiyuan_fan@yahoo.com', 'fan_ruiyuan8', 'e460376aab601447d77b4a419e422775'), -- ghRn1BLwLjCtg3L
    ('田浩', '350104197701067931', TIMESTAMP '1977-01-06 05:06:12', 0, '14518585245', 'hao.tian98@yahoo.com', 'tian21', '06dd3156fca76f995cffcc38001174c5'), -- cC3nPndBt4m0wue
    ('钟离越泽', '411527196205219445', TIMESTAMP '1962-05-21 02:48:29', 1, '14148141885', 'liyueze.zhong@gmail.com', 'zhong.liyueze57', 'ce374224cba1f4c39b327f9fa4edd8d8'), -- lc52BnOnBXFBesS
    ('罗靖琪', '659002199001117755', TIMESTAMP '1990-01-11 02:04:34', 0, '16360052953', 'jingqi62@gmail.com', 'luo_jingqi', 'cd8bb48b935036734e5bc3c8c2f1f7d5'), -- gSy4MrTWdtGphrD
    ('余潇然', '370104198308143898', TIMESTAMP '1983-08-14 03:11:51', 0, '17015277797', 'xiaoran.yu34@hotmail.com', 'yu36', 'ce27530d0b6a0e308b785fb1db406ea4'), -- eaa3G_KGwzteqtj
    ('程子涵', '152202198112096123', TIMESTAMP '1981-12-09 08:44:14', 1, '0076-99314353', 'zihan64@hotmail.com', 'cheng_zihan', '7c00750876eef85f7a24f1b33c696feb'), -- XRQVRYvx6PuffRz
    ('高鹭洋', '21032119840213437X', TIMESTAMP '1984-02-13 06:56:03', 0, '16072957863', 'luyang_gao1@gmail.com', 'gao_luyang', '590827f819286df285e65576ae5533af'), -- O_ditGzovTKg0jU
    ('彭煜城', '621123196507141272', TIMESTAMP '1965-07-14 11:10:13', 0, '0090-46339846', 'yucheng12@yahoo.com', 'peng.yucheng93', '29a07536d5d4c5be1f76f71566ca7cbc'), -- 6vSYeHau84J1nFs
    ('鲜于绍齐', '371002195212202455', TIMESTAMP '1952-12-20 05:02:17', 0, '005-60581240', 'yushaoqi.xian@hotmail.com', 'xian46', '69ad960d8b714eedce5bae415e71b5be'), -- PqXiIyixHCGhSec
    ('陈浩', '370782194405170323', TIMESTAMP '1944-05-17 12:52:00', 1, '0793-69089656', 'hao.chen@yahoo.com', 'chen.hao86', 'aae4e8a5e5b86bd15cf17a2d2affe619'), -- FvH_cTop74MFkDG
    ('熊建辉', '210502199605136446', TIMESTAMP '1996-05-13 07:23:57', 1, '0912-79484841', 'jianhui19@gmail.com', 'xiong_jianhui43', '95587d7530db25690f06dcd8f4e228ea'), -- MOAAl3DtvYXI5Ub
    ('朱瑞霖', '621123198604230544', TIMESTAMP '1986-04-23 08:52:44', 1, '054-96653132', 'ruilin_zhu97@yahoo.com', 'zhu30', 'b545960c3c4633819407592176a22f8b'), -- VTI7UCbnNBxRNNe
    ('宇文瑾瑜', '150522196507159574', TIMESTAMP '1965-07-15 02:34:43', 0, '073-82501776', 'wenjinyu_yu@hotmail.com', 'yu.wenjinyu40', 'e20e59a726ff37e3a79de06f1939d93f'), -- hmyhui8BNrNlOOq
    ('苏黎昕', '220106194403060780', TIMESTAMP '1944-03-06 12:47:04', 1, '074-94067675', 'lixin30@hotmail.com', 'su_lixin', 'c5d99a11a40101eb0f25594e7743f6e2'), -- ok1TbEdaZCy4dJ3
    ('高明辉', '450108195005157166', TIMESTAMP '1950-05-15 07:04:20', 1, '093-83459890', 'minghui_gao70@hotmail.com', 'gao_minghui', 'c7577649b3c75434b47a7e3c86e3076d'), -- RUzExLFhxSowLez
    ('洪笑愚', '532928196710072692', TIMESTAMP '1967-10-07 04:58:04', 0, '0274-22702848', 'xiaoyu_hong@yahoo.com', 'hong_xiaoyu', 'adbc606504dcf959c03545ae393ec1a9'), -- D2YF0ze6MdYWbzm
    ('毛涛', '652324200211057764', TIMESTAMP '2002-11-05 10:20:03', 1, '027-52922561', 'tao_mao36@gmail.com', 'mao33', '7ae625c78eae59071fd78d2b650548a6'), -- Nqb5iSk2dZTZsMF
    ('孟昊焱', '152526199001275520', TIMESTAMP '1990-01-27 06:01:39', 1, '089-10371183', 'haoyan84@hotmail.com', 'meng.haoyan66', 'cdd8f5e2c494cb522e025429f0b68100'), -- 2EVxRKdW6FOyvPh
    ('韦志强', '211282195410077677', TIMESTAMP '1954-10-07 05:20:50', 0, '0138-48839121', 'zhiqiang_wei29@gmail.com', 'wei_zhiqiang', 'c7bbc9443285dbcf48be7f212601ad28'), -- AQBHOK9l0g1C7NF
    ('何鑫鹏', '530925200003029181', TIMESTAMP '2000-03-02 08:35:29', 1, '0207-66651115', 'xinpeng.he@yahoo.com', 'he_xinpeng19', '87980fcb21e28c1e4d87b147ba853925'), -- YfwvHO8VzZmwrzQ
    ('沈金鑫', '513222196603049400', TIMESTAMP '1966-03-04 03:15:17', 1, '0494-48800441', 'jinxin76@hotmail.com', 'shen0', '72abf87eb422f1caa58517a964df1ef6'), -- E5BxTJznRn7S4as
    ('司空昊天', '610200194511212341', TIMESTAMP '1945-11-21 12:28:15', 1, '18143759631', 'konghaotian9@hotmail.com', 'si.konghaotian33', '87259a11b757cdf6ccbc94c03a53b677'), -- KJ0dDXa18IrCW5W
    ('董展鹏', '320203198009158955', TIMESTAMP '1980-09-15 09:20:24', 0, '0144-29507711', 'zhanpeng_dong@yahoo.com', 'dong75', '617e737c73295ec377160fc2362c77ee'), -- 2tnU_1HmR6qtT6g
    ('龚语堂', '210113194306235001', TIMESTAMP '1943-06-23 04:12:36', 1, '0495-23673925', 'yutang0@yahoo.com', 'gong_yutang58', '83cf984ca07006850291f7634b186a7d'), -- HNMFQ_tjVp4e5q9
    ('叶烨霖', '420682199910045999', TIMESTAMP '1999-10-04 04:58:37', 0, '0422-36331198', 'yelin_ye@gmail.com', 'ye52', '2d70dc54cf322fb2bca043a6a8e53d27'), -- BK4H2QONmGWtAOr
    ('邹昊天', '610000198910039626', TIMESTAMP '1989-10-03 07:44:58', 1, '023-67277756', 'haotian_zou@hotmail.com', 'zou.haotian', '557650546b0e1d829997534e95b68a71'), -- q3tqc60b5euH_oz
    ('薛文轩', '130129196501039787', TIMESTAMP '1965-01-03 07:19:43', 1, '15463665759', 'wenxuan_xue@yahoo.com', 'xue_wenxuan', 'f5a31ad65a9fd7e8333ce89c71e6b271'), -- 8NXOAi5OLUkB9pq
    ('卢越泽', '420625197306088420', TIMESTAMP '1973-06-08 05:39:02', 1, '13008319634', 'yueze13@gmail.com', 'lu84', 'ba01788e0240489c1c52a1d9fa2fb1a4'), -- 84OwbvwvJ2IYWNf
    ('何君浩', '410403200011058991', TIMESTAMP '2000-11-05 06:37:41', 0, '13733422460', 'junhao.he@yahoo.com', 'he55', 'e21da85165e0adc22286d21f115e94fe'), -- icS3I6Sp3Bimd46
    ('薛琪', '65292419940415952X', TIMESTAMP '1994-04-15 05:02:08', 1, '0942-85794939', 'qi.xue63@yahoo.com', 'xue.qi', 'cfd8084c9017bcf75054f65ad271b1a4'), -- WOVXod15jMRU2M3
    ('任烨伟', '622922194510085097', TIMESTAMP '1945-10-08 11:39:00', 0, '13201645326', 'yewei83@gmail.com', 'ren.yewei10', 'd3b930b67adc7f168596ee8ce9291a3c'), -- LSo60D8Egr4G3sX
    ('姚烨霖', '431381195404235920', TIMESTAMP '1954-04-23 08:52:12', 1, '16811634566', 'yelin90@yahoo.com', 'yao47', '8d49ecd168262cf80e6a8e4453ef96ca'), -- bb7MCD5Q_ovWlf1
    ('于子涵', '532626199309274359', TIMESTAMP '1993-09-27 10:51:01', 0, '15938685790', 'zihan.yu@yahoo.com', 'yu.zihan19', 'f23ed9207a1bf79fe28a31ee102916b5'), -- uDmKFRxt_IA6xZi
    ('杨烨华', '630122200007077328', TIMESTAMP '2000-07-07 06:04:21', 1, '18480415801', 'yehua64@hotmail.com', 'yang72', '014654d485f9097f13233ca36c962e45'); -- 4lYu31oPfKWCGQd

INSERT INTO shop (shop_name, shop_password, shop_location, shop_phone, delivery_range, business_status) VALUES
    ('戴氏蛋糕', 'e831729766e13695f52208257ddd648f', '重庆市太徽市何栋939号', '13993938832', '重庆市太徽市', 1), -- qGuwRk5gcPyh6ig
    ('陈阁烤鱼', '4adb91ac1583e5aff319b7c12fb240e4', '澳门诸都市龙中心82917号', '11749740580', '澳门诸都市', 1), -- 9W9o4qq7dB2Kzwg
    ('诸口羊汤', '68e247f1bb267197bf42243f281df123', '香港诸京市赵桥25号', '0173-57091470', '香港诸京市', 1), -- yt0636DByW3f6Q2
    ('江阁蛋糕', 'd4db3f7832d80490ab07f6e786ed8d44', '江苏省贵门市谭栋304号', '0624-00249532', '江苏省贵门市', 1), -- YVQKL8JAo7YWHlv
    ('范老师小吃', '0ad20a5ceddbe61775e7d2e8d47181f6', '山西省厦汉市彭侬596号', '18239131520', '山西省厦汉市', 1), -- c3sH6LYRUVBa3JF
    ('段阁烤鱼', 'f0b5664fdca8635783d1f25bd24b063a', '辽宁省诸都市余中心03993号', '0007-50327180', '辽宁省诸都市', 1), -- dVEQrpinEfTS2Bm
    ('夏记海鲜', '511c4c0bfc1c0afe47c675cc6d6e33e3', '宁夏长汉市苏桥1号', '11596545295', '宁夏长汉市', 1), -- KOQSXuQtP3gILrG
    ('江阁披萨', 'a2d3232f9f6731f733d6ea6a6d33469a', '宁夏厦口市苏中心503号', '080-94553393', '宁夏厦口市', 1), -- nkVDdVwyy7ON3q7
    ('衡安羊汤', 'c5d8f755b7af1830f61a31e4fbd18f7c', '安徽省西原市钟桥72号', '11356634244', '安徽省西原市', 1), -- mIjFUJiRtSq5D2X
    ('孙家海鲜', '5df7460358c926ae822a98d7a991a4c9', '甘肃省海林市司马街6号', '0271-45824837', '甘肃省海林市', 1), -- EERsdll6HEMqvhw
    ('孙阁羊汤', '4c839402570d2dd916f6d28106ced581', '天津市宁门市袁路67132号', '18305995687', '天津市宁门市', 1), -- tek_usAkNN6JgQd
    ('邹大妈川菜', '741c56af4c25d32b76fd2ebce3cabea2', '西藏长安市罗路5786号', '0280-04498457', '西藏长安市', 1), -- uNIyITzcuXw2qVd
    ('福都小吃', 'f3002b332f59463e120e4d902733e1bc', '宁夏长林市叶巷8号', '0799-38975523', '宁夏长林市', 1), -- WonDCUK0Qaofazk
    ('海乡火锅', '38e4243930dfa2e713712daa35ae12b0', '河北省武阳市贺旁46号', '0634-79095901', '河北省武阳市', 1), -- J34La9tMB59oLVj
    ('王老师面馆', '61aa7a11c60afb67b4beb7430e8de98b', '西藏成徽市邓中心50814号', '060-13863626', '西藏成徽市', 1), -- yp2mJzal_33__pR
    ('苏老师粥', '1f053a543c8757eac1a1d2f077a2b48a', '重庆市海安市钟离侬440号', '0258-40432585', '重庆市海安市', 1), -- wnsEShLxjD04_kh
    ('海汉披萨', '3b8547b188c993bb6a997c1d674f40fb', '江西省成码市慕容旁4号', '16864971387', '江西省成码市', 1), -- fTC6xO20WLExykN
    ('程阁羊汤', '0e210444a35c6b4444a85c2bdacbda73', '浙江省包门市王栋629号', '050-17325608', '浙江省包门市', 1), -- Wwz6l83eUVmTQdB
    ('程阁拌饭', '9ac3e8faf15003a38fab44f460871840', '重庆市厦都市郝街24192号', '16022612103', '重庆市厦都市', 1), -- ITgLmFGJzTeUkRE
    ('魏记火锅', '22486b30cb89bd25d2d7415210ef0e0b', '贵州省北阳市余旁679号', '15384874566', '贵州省北阳市', 0); -- vW1alnuvxYBKen5

INSERT INTO courier (cour_name, cour_password, cour_phone, cour_living, cour_onboarding_time, cour_temperature, cour_COVID) VALUES
    ('郝楷瑞', '7d9f279e28ffc593bbc74418081f5970', '057-76370294', '山东省福头市谢旁19号', TIMESTAMP '2016-10-10 11:59:55', 35.75, TIMESTAMP '2022-11-27 12:25:37'), -- qca_Q2KHmHTWDlR
    ('钟离子涵', 'c06bcbdaeb390071bdc4b7749ec86224', '0968-75030653', '新疆衡汉市贺栋784号', TIMESTAMP '2013-11-01 11:26:01', 36.55, TIMESTAMP '2022-11-27 01:03:46'), -- kGpmnKCUylcTCzg
    ('胡浩', '9533e956da1ea18df0083a7cd487e701', '058-75567084', '河北省吉南市侯桥40号', TIMESTAMP '2017-07-09 11:42:00', 36.35, TIMESTAMP '2022-11-25 07:02:54'), -- PWDnQng7RUMFS1m
    ('慕容雪松', '57bdc9c9f108c22ddf36b3342880efc0', '095-20074819', '江苏省上头市彭街6070号', TIMESTAMP '2015-06-13 04:45:56', 35.62, TIMESTAMP '2022-11-27 12:36:54'), -- GSX5VuAiqu6lFxm
    ('张哲瀚', 'c4276fd7fdef32acf8b5386b7c477c58', '0303-65866821', '江西省成原市钱旁0045号', TIMESTAMP '2017-08-27 06:22:02', 35.96, TIMESTAMP '2022-11-27 05:11:12'), -- yw9GAZ_ygZhPyy9
    ('吴立辉', 'ce2966c2143f8f69107d2fe2b021e123', '0209-53893165', '青海省上口市姚路19359号', TIMESTAMP '2020-08-24 07:27:06', 35.52, TIMESTAMP '2022-11-28 05:42:02'), -- LSuCXsFN9TvdmYu
    ('萧睿渊', '2541824c7f3096764535ce9c7c403591', '18813278697', '江西省诸沙市赵旁921号', TIMESTAMP '2019-08-04 11:52:28', 36.23, TIMESTAMP '2022-11-27 06:53:21'), -- sFxsRcNPccflXjP
    ('欧阳晟睿', '04d64907c4e4bc3629272fb8ee634dc9', '0588-88641817', '内蒙古太头市范中心7号', TIMESTAMP '2016-05-04 12:01:04', 36.57, TIMESTAMP '2022-11-26 03:52:22'), -- Rf4_vPnDijrHk1b
    ('武致远', '0dda0c3e8a519651cf274ba80936ba09', '032-26311001', '青海省南南市韩中心6号', TIMESTAMP '2020-10-30 05:38:28', 35.84, TIMESTAMP '2022-11-27 05:26:25'), -- JWjEYKs_N76ba6K
    ('苏智渊', '7045778ea6b7f2c1bb30cde1e1baf07c', '0422-72827244', '四川省上海市韦桥5号', TIMESTAMP '2013-09-15 12:01:21', 36.53, TIMESTAMP '2022-11-27 07:44:03'), -- s1gYyH840Qp7YoQ
    ('赵昊强', 'fe3a921b26324355b9561ee008f8f034', '14289834121', '西藏成都市方中心046号', TIMESTAMP '2019-04-06 06:17:29', 35.81, TIMESTAMP '2022-11-27 10:29:02'), -- LZpWK_oYcgtcg48
    ('胡子轩', 'b026cf5af7bd43476ba01a94b8b85f2e', '13336567490', '北京市北林市孔桥53号', TIMESTAMP '2014-05-20 03:03:49', 35.74, TIMESTAMP '2022-11-26 11:06:24'), -- S0z4gIIOilmXQML
    ('慕容鹏煊', '0f707127ab2e880fbe1184c2da428118', '037-61271028', '湖南省诸门市董街9678号', TIMESTAMP '2016-05-08 12:30:59', 35.96, TIMESTAMP '2022-11-27 12:33:23'), -- cSkHm9d07s5NToZ
    ('赖潇然', '67824eb12ece9f700fb6242058bf13b3', '074-04567794', '吉林省上州市慕容街6号', TIMESTAMP '2016-04-16 12:00:29', 35.5, TIMESTAMP '2022-11-28 09:23:39'), -- ZCqeiVjR0lkoCvK
    ('孙擎宇', '966a0e55e9ea6dbb3a7e79693928b6b9', '006-34337640', '西藏济京市黄街37880号', TIMESTAMP '2021-03-07 04:03:33', 36.39, TIMESTAMP '2022-11-26 03:19:52'), -- ND0C44R_NKGifF_
    ('蒋文博', '41bb50b60325984ad797d9a5dc6ab340', '0956-79489430', '湖北省武林市汪侬0号', TIMESTAMP '2018-03-09 12:31:32', 36.08, TIMESTAMP '2022-11-26 11:59:17'), -- hsSJAJ6RhFjD7pT
    ('李昊强', '6a82cacc24bb7202ce596ba08c60aabf', '0863-81437313', '四川省上徽市黄路81号', TIMESTAMP '2015-11-04 09:22:33', 36.41, TIMESTAMP '2022-11-28 03:55:22'), -- uKNKaZ2tPpb_NjQ
    ('冯梓晨', '64ccae030a79e7ac43cbdca3b8a62fc9', '14765805678', '甘肃省武头市姜巷1893号', TIMESTAMP '2016-08-14 07:21:10', 35.37, TIMESTAMP '2022-11-28 03:32:10'), -- mEVkQlmXwQtWS91
    ('谭修洁', '805411cf4febea96a5d34e4a93b700bd', '018-99098365', '湖北省厦林市董路854号', TIMESTAMP '2017-06-06 01:49:03', 36.64, TIMESTAMP '2022-11-27 12:39:25'), -- sc8W24o1kXug5dL
    ('袁熠彤', '08c724c72e62c5fe4ab514cc2cd8fff4', '10825926000', '天津市衡头市于巷46667号', TIMESTAMP '2021-04-24 04:34:50', 35.33, TIMESTAMP '2022-11-27 07:30:03'); -- 7IESOtxehLtKUUV

INSERT INTO dish (shop_id, dish_name, dish_value, dish_score, dish_sales) VALUES
    (12, '水果沙拉+米饭', 2876, 2667, 652), -- 
    (1, '【新店特惠】青椒土豆丝+米饭', 2833, 1441, 406), -- 
    (17, '煎蛋', 3847, 1079, 348), -- 
    (8, '【新品上市】煎蛋+自选饮品', 1104, 1455, 297), -- 
    (3, '咖喱鸡', 2724, 3060, 705), -- 
    (16, '【招牌】卤肉饭+自选饮品', 4241, 2657, 540), -- 
    (2, '干板牛杂', 307, 2511, 686), -- 
    (4, '【超值】小炒牛肉+米饭', 4301, 3658, 873), -- 
    (3, '水煮白肉', 4203, 3422, 992), -- 
    (17, '【超值】白菜汤+米饭', 4303, 2407, 569), -- 
    (3, '【新店特惠】葡萄酒', 4149, 4219, 892), -- 
    (6, '意大利肉酱面', 2745, 2638, 560), -- 
    (18, '剁椒鱼头', 4536, 1967, 414), -- 
    (7, '葱爆牛肉+小菜', 773, 3684, 993), -- 
    (7, '【新店特惠】芙蓉鸡片', 3613, 267, 64), -- 
    (14, '香辣鸡腿堡', 1213, 60, 14), -- 
    (7, '红焖猪尾', 2200, 3719, 855), -- 
    (19, '皮蛋瘦肉粥', 4259, 682, 170), -- 
    (2, '油门小龙虾', 4270, 2467, 689), -- 
    (16, '【精品】蛋炒饭', 4524, 2608, 703), -- 
    (19, '【新店特惠】芦荟汁套餐', 2921, 3195, 843), -- 
    (3, '木须肉便当', 3610, 1858, 380), -- 
    (8, '【人气】夫妻肺片', 477, 2408, 605), -- 
    (18, '双椒酱蒸鱼头', 1022, 1661, 480), -- 
    (15, '秘制小汉堡', 1063, 1121, 232), -- 
    (19, '【新店特惠】奶香馒头便当', 1505, 1648, 428), -- 
    (10, '山楂银耳汤便当', 2799, 2592, 540), -- 
    (9, '【热销999】牛肉煎饺', 968, 2549, 547), -- 
    (20, '糖醋里脊', 3699, 1122, 338), -- 
    (2, '【人气】红烧茄子', 1444, 333, 87), -- 
    (2, '地三鲜', 4940, 2000, 608), -- 
    (16, '韭菜炒鸡蛋+米饭', 4506, 1251, 405), -- 
    (19, '【精品】葡萄酒', 1376, 1102, 340), -- 
    (14, '鱼头豆腐汤', 899, 1095, 286), -- 
    (1, '【人气】黑米饭', 785, 2280, 750), -- 
    (3, '干板牛杂', 3263, 3587, 844), -- 
    (13, '【超值】番茄牛肉', 2576, 3465, 802), -- 
    (8, '【招牌】炸酱面便当', 226, 4900, 986), -- 
    (1, '【招牌】八宝粥', 3974, 2631, 586), -- 
    (13, '【人气】拔丝山药+自选饮品', 274, 4260, 966), -- 
    (8, '烟熏猪头', 215, 2830, 830), -- 
    (10, '香辣鸡腿堡便当', 4667, 771, 185), -- 
    (10, '【划算】盐焗鸡+米饭', 4390, 2119, 592), -- 
    (2, '油门小龙虾', 4622, 4319, 986), -- 
    (12, '【超值】京酱肉丝+自选饮品', 1910, 1033, 230), -- 
    (12, '【人气】香辣蟹', 3389, 1003, 209), -- 
    (11, '【划算】木须肉', 4725, 2058, 502), -- 
    (7, '水煮鳝鱼套餐', 3991, 2673, 570), -- 
    (2, '【新品上市】葱爆羊肉', 3876, 316, 71), -- 
    (12, '【新品上市】糖醋里脊', 2318, 1795, 507), -- 
    (11, '臭豆腐', 1320, 3476, 963), -- 
    (11, '金枪鱼披萨', 1791, 1682, 499), -- 
    (15, '鲜肉水饺', 2263, 1037, 247), -- 
    (16, '【超值】可乐鸡翅便当', 955, 2261, 537), -- 
    (5, '菌汤老鸭', 3058, 288, 67), -- 
    (9, '【人气】猪肉炖粉条', 709, 1037, 322), -- 
    (14, '猪肉炖粉条+自选饮品', 4278, 2334, 753), -- 
    (5, '【新店特惠】芙蓉鸡片', 3445, 3509, 785), -- 
    (16, '泡椒凤爪套餐', 306, 2170, 452), -- 
    (10, '蛋挞+米饭', 1652, 1633, 486), -- 
    (1, '【新店特惠】东坡肉', 3030, 1101, 367), -- 
    (1, '【招牌】皮蛋瘦肉粥便当', 575, 1223, 327), -- 
    (5, '【新品上市】泡椒凤爪', 4453, 569, 151), -- 
    (18, '【划算】臭豆腐', 2428, 2262, 744), -- 
    (19, '【精品】拔丝山药', 3102, 885, 238), -- 
    (16, '【新店特惠】黑米饭', 4500, 230, 47), -- 
    (11, '【精品】双椒酱蒸鱼头', 2031, 2506, 646), -- 
    (3, '千层肉饼', 710, 2723, 746), -- 
    (5, '【热销999】蛋炒饭+小菜', 2762, 1706, 417), -- 
    (14, '【热销999】黄焖鸡', 1454, 997, 294), -- 
    (9, '【人气】可乐鸡翅', 294, 4096, 999), -- 
    (8, '【新店特惠】鲜肉水饺+米饭', 4942, 2611, 579), -- 
    (16, '【新品上市】木须肉', 4037, 1159, 385), -- 
    (14, '【精品】双椒酱蒸鱼头套餐', 851, 3898, 824), -- 
    (13, '盐焗鸡', 2104, 2923, 720), -- 
    (4, '【热销999】豆角焖面套餐', 402, 3274, 744), -- 
    (18, '牛肉汤盒饭', 426, 3089, 739), -- 
    (13, '红烧翅根', 4580, 3806, 999), -- 
    (2, '【划算】清蒸鲈鱼便当', 2223, 1234, 283), -- 
    (15, '【招牌】窝窝头+米饭', 2211, 3402, 989), -- 
    (6, '清炒苦瓜', 2691, 273, 72), -- 
    (16, '腐乳烧鸡翅', 4513, 2843, 690), -- 
    (8, '【划算】番茄炒包菜', 2210, 470, 139), -- 
    (4, '干板牛肉', 3562, 1878, 535), -- 
    (4, '卤肉饭+米饭', 3659, 2868, 788), -- 
    (20, '清炒苦瓜', 4359, 2837, 618), -- 
    (18, '香酥鸡', 3126, 2576, 687), -- 
    (13, '孜然羊肉', 4096, 490, 114), -- 
    (1, '【新店特惠】茶叶蛋+米饭', 2169, 655, 170), -- 
    (12, '【超值】窝窝头', 2311, 3107, 807), -- 
    (6, '罗宋汤', 2963, 3309, 821), -- 
    (6, '水煮蛋+小菜', 3805, 3079, 853), -- 
    (15, '红油猪耳朵', 3701, 3163, 706), -- 
    (4, '【热销999】菜花炒肉', 4045, 3567, 767), -- 
    (17, '【新品上市】碳烤大鱼', 4429, 1318, 337), -- 
    (13, '番茄炒包菜', 1785, 75, 15), -- 
    (4, '【超值】韭菜炒鸡蛋', 266, 3412, 702), -- 
    (16, '干板牛肉', 1199, 2197, 678), -- 
    (4, '牛肉煎饺', 1755, 3249, 950), -- 
    (9, '【人气】豆角焖面', 960, 925, 257), -- 
    (19, '【热销999】牛肉灌汤包盒饭', 996, 2540, 779), -- 
    (12, '猪扒饭', 4863, 875, 221), -- 
    (10, '【超值】锅包肉', 3807, 2940, 610), -- 
    (8, '腊八粥便当', 1484, 1141, 360), -- 
    (8, '拔丝山药便当', 3100, 654, 136), -- 
    (12, '牛肉水饺', 3202, 1956, 625), -- 
    (19, '菜花炒肉', 3315, 1531, 494), -- 
    (18, '【划算】葱花饼', 2861, 403, 134), -- 
    (2, '【热销999】萝卜汤', 4580, 1943, 417), -- 
    (7, '蒜蓉海带丝', 3897, 1866, 463), -- 
    (10, '【热销999】炒百合', 2069, 1496, 435), -- 
    (15, '皮蛋瘦肉粥', 2763, 4247, 997), -- 
    (14, '【招牌】宫保鸡丁', 275, 2364, 530), -- 
    (4, '【精品】酱肉炒饭', 4804, 4059, 830), -- 
    (14, '菌汤老鸭', 2028, 339, 83), -- 
    (7, '烤韭菜', 3756, 1820, 523), -- 
    (11, '千叶豆腐', 2783, 2384, 516), -- 
    (2, '【热销999】剁椒鱼头', 117, 874, 233), -- 
    (15, '香酥鸡', 2862, 577, 155), -- 
    (9, '【超值】可乐鸡翅盒饭', 1672, 3200, 800), -- 
    (5, '【新店特惠】蒜香龙虾便当', 3594, 244, 67), -- 
    (20, '黑米饭盒饭', 4659, 4211, 940), -- 
    (5, '皮蛋瘦肉粥+自选饮品', 3307, 1191, 267), -- 
    (6, '油门小龙虾', 2664, 4142, 863), -- 
    (19, '凉皮盒饭', 215, 2721, 805), -- 
    (20, '【新品上市】凉皮', 2384, 3137, 630), -- 
    (6, '奥尔良烤鸡翅+米饭', 4054, 748, 228), -- 
    (17, '【划算】麻辣肉片', 1481, 1493, 348), -- 
    (4, '【热销999】葡萄酒', 2196, 1280, 389), -- 
    (1, '炖排骨+米饭', 2113, 589, 137), -- 
    (10, '萝卜汤套餐', 2569, 1341, 447), -- 
    (4, '【划算】酱香茄子便当', 950, 3082, 966), -- 
    (7, '【精品】牛肉煎饺', 4098, 2093, 513), -- 
    (4, '【人气】青椒土豆丝+自选饮品', 1744, 1840, 424), -- 
    (20, '【新品上市】凉拌折耳根', 3295, 1413, 369), -- 
    (13, '炒百合', 3433, 1864, 512), -- 
    (9, '【超值】大将军鸡排', 1291, 780, 259), -- 
    (5, '油门小龙虾', 1623, 777, 173), -- 
    (5, '麻辣小龙虾套餐', 1023, 421, 104), -- 
    (10, '【新店特惠】香辣鸡腿堡', 3586, 2265, 483), -- 
    (6, '【热销999】葱爆牛肉便当', 556, 1947, 632), -- 
    (17, '【招牌】清炒时蔬', 2009, 361, 98), -- 
    (13, '鸭血粉丝汤+米饭', 1803, 3386, 834), -- 
    (12, '【人气】粉蒸肉', 3401, 3361, 853), -- 
    (3, '【超值】烤面筋', 1084, 1187, 288), -- 
    (17, '【热销999】口水鸡', 2637, 4089, 887), -- 
    (7, '【超值】啤酒鸭', 1912, 562, 128), -- 
    (8, '土豆泥+小菜', 1413, 2156, 634), -- 
    (16, '【超值】蒸鸡蛋羮+米饭', 212, 2467, 651), -- 
    (1, '【划算】小炒肉', 4848, 4831, 992), -- 
    (15, '上校鸡块套餐', 2689, 1155, 328), -- 
    (12, '【新店特惠】炸酱面+小菜', 3169, 2669, 569), -- 
    (6, '【划算】蒜蓉海带丝', 3086, 3029, 915), -- 
    (5, '香辣蟹', 2520, 4233, 893), -- 
    (12, '【热销999】碳烤大鱼', 4671, 4134, 863), -- 
    (12, '【新品上市】香酥鸡', 4958, 941, 212), -- 
    (13, '【新品上市】水煮肥牛盒饭', 3288, 2626, 746), -- 
    (8, '【精品】手撕包菜', 1197, 4525, 999), -- 
    (14, '凉拌黑木耳盒饭', 2691, 2440, 632), -- 
    (6, '酸汤水饺', 439, 614, 152), -- 
    (6, '【招牌】羊肉灌汤包', 1668, 128, 32), -- 
    (12, '酸辣土豆丝套餐', 1325, 720, 217), -- 
    (12, '【新品上市】麻辣香锅', 1722, 2566, 653), -- 
    (8, '红烧翅根', 303, 963, 201), -- 
    (18, '【招牌】臭豆腐+自选饮品', 4254, 1585, 469), -- 
    (14, '【精品】焦糖布丁', 3924, 377, 77), -- 
    (2, '西红柿鸡蛋面', 3870, 3887, 860), -- 
    (10, '【新店特惠】醋溜白菜套餐', 4896, 3326, 899), -- 
    (17, '土豆泥', 1128, 1789, 531), -- 
    (3, '蒜蓉海带丝+米饭', 2440, 236, 76), -- 
    (6, '【热销999】蒜香龙虾+米饭', 1308, 3377, 714), -- 
    (4, '【精品】凉皮+小菜', 2999, 651, 162), -- 
    (13, '糖醋鲤鱼套餐', 4214, 3727, 934), -- 
    (19, '孜然羊肉', 4322, 1294, 296), -- 
    (16, '【超值】意大利肉酱面', 2138, 3005, 936), -- 
    (12, '牛肉灌汤包', 3159, 2416, 673), -- 
    (7, '金枪鱼披萨', 4237, 416, 89), -- 
    (10, '鲜肉水饺', 1068, 2561, 793), -- 
    (13, '【新品上市】葱爆牛肉', 2777, 320, 74), -- 
    (18, '黑米饭', 1748, 1097, 238), -- 
    (3, '红油猪耳朵', 2812, 1478, 392), -- 
    (12, '照烧猪排', 342, 2844, 578), -- 
    (17, '蒜蓉西兰花+小菜', 2169, 1261, 338), -- 
    (5, '【新店特惠】葡萄酒+自选饮品', 1652, 3185, 910), -- 
    (19, '【新品上市】剁椒鱼头', 2860, 2802, 697), -- 
    (7, '【人气】京酱肉丝', 1509, 1623, 465), -- 
    (13, '梅菜扣肉+自选饮品', 2793, 188, 46), -- 
    (6, '鸡蛋灌饼', 4003, 2180, 722), -- 
    (13, '【新店特惠】白灼虾便当', 4843, 3260, 753), -- 
    (3, '【热销999】烧烤排骨+小菜', 4425, 1119, 267), -- 
    (18, '【招牌】辣子鸡', 4184, 2695, 807), -- 
    (20, '八宝饭', 111, 2538, 569), -- 
    (1, '酸汤水饺套餐', 798, 2936, 941), -- 
    (19, '【精品】羊肉煎饺', 960, 3843, 781), -- 
    (1, '【人气】芦荟汁便当', 926, 1436, 426), -- 
    (10, '【热销999】皮蛋瘦肉粥', 2664, 2888, 598), -- 
    (10, '香辣蟹+自选饮品', 2532, 2002, 417), -- 
    (3, '【新店特惠】佛跳墙', 4248, 4293, 887), -- 
    (8, '臭豆腐', 889, 1437, 413), -- 
    (16, '【新店特惠】毛血旺', 3914, 1602, 386); -- 

INSERT INTO orders (cust_id, shop_id, cour_id, order_begin_time, order_state) VALUES
    (5, 11, 11, TIMESTAMP '2022-11-21 09:28:50', 5), -- 
    (48, 16, 17, TIMESTAMP '2022-11-01 11:39:51', 1), -- 
    (12, 3, 4, TIMESTAMP '2022-11-10 05:30:58', 5), -- 
    (13, 8, 10, TIMESTAMP '2022-09-30 03:40:54', 5), -- 
    (13, 15, 11, TIMESTAMP '2022-10-03 11:23:08', 5), -- 
    (34, 9, 4, TIMESTAMP '2022-10-09 12:44:27', 5), -- 
    (24, 16, 8, TIMESTAMP '2022-10-20 11:32:51', 6), -- 
    (34, 10, 15, TIMESTAMP '2022-11-13 05:30:53', 6), -- 
    (25, 14, 1, TIMESTAMP '2022-11-24 07:43:34', 5), -- 
    (8, 17, 3, TIMESTAMP '2022-10-11 07:26:52', 5), -- 
    (27, 1, 17, TIMESTAMP '2022-11-13 09:24:15', 5), -- 
    (34, 8, 14, TIMESTAMP '2022-11-08 03:01:27', 5), -- 
    (15, 1, 17, TIMESTAMP '2022-11-25 11:17:16', 5), -- 
    (31, 6, 11, TIMESTAMP '2022-10-27 05:07:50', 5), -- 
    (6, 19, 12, TIMESTAMP '2022-10-29 09:48:20', 5), -- 
    (20, 17, 14, TIMESTAMP '2022-11-12 04:23:35', 5), -- 
    (41, 4, 8, TIMESTAMP '2022-10-29 10:39:19', 5), -- 
    (50, 19, 15, TIMESTAMP '2022-10-13 06:17:53', 5), -- 
    (35, 3, 7, TIMESTAMP '2022-10-20 03:46:51', 5), -- 
    (23, 13, 7, TIMESTAMP '2022-11-07 08:13:07', 5), -- 
    (7, 9, 1, TIMESTAMP '2022-10-18 11:52:17', 2), -- 
    (44, 13, 14, TIMESTAMP '2022-10-02 05:19:28', 5), -- 
    (33, 18, 9, TIMESTAMP '2022-10-01 02:08:20', 5), -- 
    (26, 20, 15, TIMESTAMP '2022-11-27 03:36:49', 5), -- 
    (45, 6, 17, TIMESTAMP '2022-11-25 09:06:20', 3), -- 
    (32, 4, 13, TIMESTAMP '2022-10-09 06:35:16', 5), -- 
    (48, 10, 7, TIMESTAMP '2022-11-11 05:27:53', 5), -- 
    (18, 1, 16, TIMESTAMP '2022-11-18 01:46:14', 5), -- 
    (9, 13, 16, TIMESTAMP '2022-11-14 08:43:14', 5), -- 
    (48, 5, 9, TIMESTAMP '2022-10-17 09:50:09', 3), -- 
    (6, 10, 19, TIMESTAMP '2022-10-09 07:28:39', 5), -- 
    (22, 12, 12, TIMESTAMP '2022-10-30 04:20:51', 5), -- 
    (27, 17, 13, TIMESTAMP '2022-10-01 04:45:11', 5), -- 
    (10, 20, 3, TIMESTAMP '2022-11-27 02:02:29', 5), -- 
    (18, 11, 15, TIMESTAMP '2022-10-03 11:14:47', 5), -- 
    (39, 17, 11, TIMESTAMP '2022-11-03 06:51:20', 4), -- 
    (14, 12, 9, TIMESTAMP '2022-11-25 02:44:34', 5), -- 
    (7, 5, 15, TIMESTAMP '2022-10-03 11:41:18', 5), -- 
    (39, 9, 18, TIMESTAMP '2022-10-03 05:31:55', 5), -- 
    (42, 8, 2, TIMESTAMP '2022-11-17 01:34:27', 5), -- 
    (28, 12, 7, TIMESTAMP '2022-10-06 11:07:46', 5), -- 
    (35, 1, 10, TIMESTAMP '2022-11-09 01:44:07', 5), -- 
    (43, 16, 17, TIMESTAMP '2022-10-22 08:02:09', 2), -- 
    (38, 1, NULL, TIMESTAMP '2022-11-28 03:42:40', 0), -- 
    (44, 20, 17, TIMESTAMP '2022-11-09 08:53:59', 5), -- 
    (41, 5, 4, TIMESTAMP '2022-10-16 06:07:28', 5), -- 
    (31, 4, 14, TIMESTAMP '2022-11-22 08:02:32', 5), -- 
    (1, 20, 10, TIMESTAMP '2022-10-31 11:23:22', 5), -- 
    (19, 19, 5, TIMESTAMP '2022-11-07 07:45:59', 3), -- 
    (47, 2, 8, TIMESTAMP '2022-10-28 10:41:39', 5), -- 
    (23, 11, 2, TIMESTAMP '2022-10-29 11:05:06', 5), -- 
    (29, 18, 1, TIMESTAMP '2022-10-11 09:41:07', 5), -- 
    (19, 9, 8, TIMESTAMP '2022-10-16 02:28:02', 5), -- 
    (35, 17, 6, TIMESTAMP '2022-11-07 03:43:14', 5), -- 
    (43, 10, 11, TIMESTAMP '2022-10-20 03:20:30', 5), -- 
    (25, 1, 20, TIMESTAMP '2022-10-17 02:40:32', 1), -- 
    (45, 4, 11, TIMESTAMP '2022-10-23 07:13:16', 5), -- 
    (2, 1, 9, TIMESTAMP '2022-10-16 08:10:15', 5), -- 
    (11, 20, 17, TIMESTAMP '2022-10-17 03:53:05', 5), -- 
    (31, 13, 17, TIMESTAMP '2022-10-29 10:00:45', 5), -- 
    (47, 15, 9, TIMESTAMP '2022-11-16 04:50:24', 5), -- 
    (27, 15, 20, TIMESTAMP '2022-10-23 01:36:19', 5), -- 
    (49, 10, 11, TIMESTAMP '2022-11-18 09:13:07', 5), -- 
    (20, 20, 5, TIMESTAMP '2022-11-20 06:29:49', 5), -- 
    (4, 7, 6, TIMESTAMP '2022-11-02 03:11:16', 2), -- 
    (25, 16, 15, TIMESTAMP '2022-11-27 04:09:06', 2), -- 
    (24, 1, 11, TIMESTAMP '2022-10-26 01:23:25', 5), -- 
    (48, 3, 2, TIMESTAMP '2022-10-06 12:03:22', 5), -- 
    (8, 2, 14, TIMESTAMP '2022-10-07 07:09:43', 5), -- 
    (2, 15, 3, TIMESTAMP '2022-10-05 07:17:42', 5), -- 
    (8, 3, 3, TIMESTAMP '2022-11-01 06:55:28', 5), -- 
    (30, 3, 10, TIMESTAMP '2022-10-18 05:00:36', 5), -- 
    (29, 13, 3, TIMESTAMP '2022-11-08 02:27:45', 5), -- 
    (22, 8, 11, TIMESTAMP '2022-11-17 10:14:42', 5), -- 
    (40, 1, 6, TIMESTAMP '2022-10-12 05:36:53', 5), -- 
    (22, 18, 14, TIMESTAMP '2022-11-12 03:56:55', 5), -- 
    (42, 13, 4, TIMESTAMP '2022-10-19 11:36:26', 6), -- 
    (4, 12, 10, TIMESTAMP '2022-10-01 09:24:20', 5), -- 
    (49, 7, 11, TIMESTAMP '2022-11-03 02:17:55', 5), -- 
    (17, 3, 18, TIMESTAMP '2022-11-06 01:35:36', 5), -- 
    (42, 10, 14, TIMESTAMP '2022-11-21 12:35:28', 5), -- 
    (4, 7, 20, TIMESTAMP '2022-10-18 12:06:20', 3), -- 
    (4, 19, 12, TIMESTAMP '2022-11-28 07:59:54', 5), -- 
    (21, 11, 6, TIMESTAMP '2022-10-18 01:59:49', 5), -- 
    (32, 8, 19, TIMESTAMP '2022-10-04 11:27:19', 5), -- 
    (25, 5, 5, TIMESTAMP '2022-10-12 10:14:53', 4), -- 
    (32, 3, 19, TIMESTAMP '2022-11-18 05:06:06', 5), -- 
    (33, 17, 17, TIMESTAMP '2022-11-15 06:44:31', 5), -- 
    (13, 9, 13, TIMESTAMP '2022-10-02 08:49:23', 5), -- 
    (25, 20, 6, TIMESTAMP '2022-10-24 01:38:52', 3), -- 
    (47, 6, 2, TIMESTAMP '2022-11-23 03:49:39', 5), -- 
    (43, 1, 17, TIMESTAMP '2022-11-10 09:58:32', 5), -- 
    (39, 6, 14, TIMESTAMP '2022-11-22 12:53:14', 4), -- 
    (34, 18, 13, TIMESTAMP '2022-10-18 10:41:13', 5), -- 
    (35, 11, 16, TIMESTAMP '2022-11-14 08:14:48', 5), -- 
    (22, 7, 4, TIMESTAMP '2022-11-05 12:51:11', 5), -- 
    (29, 8, 10, TIMESTAMP '2022-10-25 10:17:36', 1), -- 
    (20, 6, 20, TIMESTAMP '2022-11-19 03:25:12', 2), -- 
    (49, 6, 15, TIMESTAMP '2022-11-16 09:03:20', 5), -- 
    (24, 17, 2, TIMESTAMP '2022-10-22 06:55:08', 5); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (51, 1, 1), -- 
    (52, 1, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (59, 2, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (68, 3, 1), -- 
    (198, 3, 3), -- 
    (11, 3, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (72, 4, 1), -- 
    (41, 4, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (93, 5, 1), -- 
    (80, 5, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (100, 6, 1), -- 
    (120, 6, 1), -- 
    (71, 6, 1), -- 
    (28, 6, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (175, 7, 1), -- 
    (82, 7, 1), -- 
    (73, 7, 3), -- 
    (98, 7, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (168, 8, 1), -- 
    (43, 8, 1), -- 
    (178, 8, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (74, 9, 1), -- 
    (166, 9, 1), -- 
    (16, 9, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (183, 10, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (39, 11, 3), -- 
    (61, 11, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (4, 12, 1), -- 
    (41, 12, 1), -- 
    (148, 12, 1), -- 
    (104, 12, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (39, 13, 1), -- 
    (150, 13, 1), -- 
    (89, 13, 1), -- 
    (130, 13, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (141, 14, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (65, 15, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (128, 16, 1), -- 
    (183, 16, 1), -- 
    (3, 16, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (94, 17, 1), -- 
    (8, 17, 1), -- 
    (76, 17, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (26, 18, 1), -- 
    (65, 18, 1), -- 
    (21, 18, 1), -- 
    (185, 18, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (198, 19, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (136, 20, 1), -- 
    (187, 20, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (120, 21, 1), -- 
    (28, 21, 1), -- 
    (71, 21, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (173, 22, 1), -- 
    (88, 22, 2), -- 
    (179, 22, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (165, 23, 1), -- 
    (191, 23, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (29, 24, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (161, 25, 3), -- 
    (12, 25, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (172, 26, 1), -- 
    (84, 26, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (42, 27, 3), -- 
    (168, 27, 1), -- 
    (43, 27, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (61, 28, 1), -- 
    (2, 28, 1), -- 
    (89, 28, 3), -- 
    (150, 28, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (179, 29, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (123, 30, 2), -- 
    (184, 30, 1), -- 
    (58, 30, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (168, 31, 1), -- 
    (42, 31, 1), -- 
    (196, 31, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (155, 32, 4), -- 
    (163, 32, 1), -- 
    (144, 32, 1), -- 
    (45, 32, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (95, 33, 1), -- 
    (10, 33, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (192, 34, 1), -- 
    (135, 34, 2), -- 
    (29, 34, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (67, 35, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (183, 36, 1), -- 
    (142, 36, 1), -- 
    (3, 36, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (176, 37, 1), -- 
    (1, 37, 1), -- 
    (162, 37, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (123, 38, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (100, 39, 1), -- 
    (28, 39, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (72, 40, 2), -- 
    (105, 40, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (1, 41, 1), -- 
    (163, 41, 1), -- 
    (176, 41, 1), -- 
    (144, 41, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (61, 42, 3), -- 
    (2, 42, 1), -- 
    (62, 42, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (66, 43, 1), -- 
    (175, 43, 1), -- 
    (98, 43, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (193, 44, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (29, 45, 1), -- 
    (192, 45, 1), -- 
    (135, 45, 1), -- 
    (122, 45, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (121, 46, 1), -- 
    (138, 46, 1), -- 
    (184, 46, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (76, 47, 1), -- 
    (99, 47, 1), -- 
    (134, 47, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (86, 48, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (65, 49, 1), -- 
    (174, 49, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (30, 50, 1), -- 
    (7, 50, 1), -- 
    (118, 50, 2), -- 
    (44, 50, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (51, 51, 3), -- 
    (47, 51, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (108, 52, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (56, 53, 1), -- 
    (71, 53, 1), -- 
    (28, 53, 1), -- 
    (137, 53, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (10, 54, 1), -- 
    (169, 54, 1), -- 
    (128, 54, 1), -- 
    (183, 54, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (178, 55, 1), -- 
    (43, 55, 1), -- 
    (42, 55, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (130, 56, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (84, 57, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (62, 58, 1), -- 
    (193, 58, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (135, 59, 4); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (179, 60, 1), -- 
    (187, 60, 2), -- 
    (136, 60, 1), -- 
    (40, 60, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (151, 61, 1), -- 
    (25, 61, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (112, 62, 1), -- 
    (80, 62, 3), -- 
    (151, 62, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (131, 63, 1), -- 
    (42, 63, 4); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (135, 64, 1), -- 
    (126, 64, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (133, 65, 1), -- 
    (110, 65, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (73, 66, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (61, 67, 1), -- 
    (2, 67, 1), -- 
    (150, 67, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (5, 68, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (167, 69, 1), -- 
    (79, 69, 1), -- 
    (31, 69, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (25, 70, 1), -- 
    (151, 70, 2), -- 
    (119, 70, 1), -- 
    (112, 70, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (11, 71, 1), -- 
    (36, 71, 1), -- 
    (9, 71, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (170, 72, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (75, 73, 3), -- 
    (173, 73, 1), -- 
    (88, 73, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (23, 74, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (39, 75, 1), -- 
    (2, 75, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (87, 76, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (37, 77, 4), -- 
    (189, 77, 1), -- 
    (173, 77, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (162, 78, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (116, 79, 1), -- 
    (15, 79, 1), -- 
    (147, 79, 1), -- 
    (48, 79, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (170, 80, 1), -- 
    (22, 80, 1), -- 
    (9, 80, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (168, 81, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (17, 82, 1), -- 
    (48, 82, 1), -- 
    (14, 82, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (185, 83, 1), -- 
    (107, 83, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (52, 84, 3), -- 
    (51, 84, 1), -- 
    (67, 84, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (4, 85, 3), -- 
    (41, 85, 2), -- 
    (199, 85, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (55, 86, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (190, 87, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (146, 88, 1), -- 
    (95, 88, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (137, 89, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (192, 90, 1), -- 
    (135, 90, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (92, 91, 1), -- 
    (153, 91, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (35, 92, 1), -- 
    (195, 92, 1), -- 
    (2, 92, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (171, 93, 3); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (108, 94, 1), -- 
    (77, 94, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (52, 95, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (15, 96, 1), -- 
    (133, 96, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (199, 97, 1), -- 
    (23, 97, 1), -- 
    (72, 97, 1), -- 
    (158, 97, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (153, 98, 1), -- 
    (141, 98, 2); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (127, 99, 1), -- 
    (91, 99, 1); -- 

INSERT INTO contain (dish_id, order_id, contain_num) VALUES
    (142, 100, 1); -- 

INSERT INTO shopping_car (dish_id, cust_id, car_num) VALUES
    (25, 2, 2), -- 
    (53, 46, 2), -- 
    (37, 5, 4), -- 
    (124, 38, 2), -- 
    (56, 39, 4), -- 
    (196, 24, 1), -- 
    (7, 48, 1), -- 
    (4, 40, 4), -- 
    (167, 26, 4), -- 
    (80, 42, 2), -- 
    (68, 10, 3), -- 
    (10, 22, 3), -- 
    (21, 28, 4), -- 
    (56, 35, 4), -- 
    (118, 50, 4), -- 
    (119, 18, 1), -- 
    (161, 30, 4), -- 
    (38, 2, 3), -- 
    (135, 43, 1), -- 
    (29, 48, 4), -- 
    (69, 14, 1), -- 
    (105, 23, 3), -- 
    (58, 11, 3), -- 
    (46, 19, 3), -- 
    (172, 23, 2), -- 
    (134, 45, 4), -- 
    (169, 25, 4), -- 
    (186, 19, 4), -- 
    (175, 23, 3), -- 
    (117, 25, 3), -- 
    (159, 17, 1), -- 
    (58, 32, 4), -- 
    (46, 16, 1), -- 
    (14, 37, 3), -- 
    (154, 31, 1), -- 
    (94, 45, 1), -- 
    (71, 10, 4), -- 
    (189, 8, 1), -- 
    (35, 28, 1), -- 
    (59, 14, 3), -- 
    (149, 28, 4), -- 
    (57, 5, 2), -- 
    (50, 41, 3), -- 
    (108, 35, 3), -- 
    (159, 30, 2), -- 
    (18, 18, 4), -- 
    (133, 4, 4), -- 
    (181, 6, 4), -- 
    (119, 20, 1), -- 
    (91, 34, 4); -- 

