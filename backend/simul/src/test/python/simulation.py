from flask import Flask  #간단히 플라스크 서버를 만든다
from flask import request

import urllib.request

app = Flask(__name__)

@app.route("/simulation")
def simulation():
        import sys
        import inspect
        import pymongo
        import pandas as pd
        import numpy as np
        from sklearn.model_selection import train_test_split
        from sklearn.linear_model import LinearRegression
        from sklearn.preprocessing import PolynomialFeatures
        import json
        import matplotlib.pyplot as plt

        connection = pymongo.MongoClient("mongodb://localhost:27017/")
        db = connection["simulation"]
        simul = db["simul"]

        dongName = request.args.get('dongName')
        industryName = request.args.get('industryName')

        print("dongName :" + dongName + ", industryName : " + industryName)

        myquery = {"읍면동명": "개포2동", "서비스_업종_코드_명": "한식음식점"}

        doc = simul.find(myquery)

        documents = []
        for x in doc: documents.append(x)

        df = pd.DataFrame(documents)
        df.info()
        len(df)
        print(df)
        df = df.astype({'분기당_매출_금액/점포수': 'int64'})

        df.drop(['_id', '시군구명', '읍면동명', '서비스_업종_코드', '서비스_업종_코드_명'], axis=1, inplace=True)

        x = df[['기준_년_코드', '기준_분기_코드', '분기당_매출_건수', '점포수', '프랜차이즈_점포_수', '총_생활인구_수', '소득_구간_코드', '지출_총금액', '총 상주인구 수',
                '총_직장_인구_수', '아파트_평균_시가', '집객시설_수']]

        y = df[['분기당_매출_금액/점포수']]

        polynomial = PolynomialFeatures(degree=2, include_bias=False)
        features_polynomial = polynomial.fit_transform(x)

        from sklearn.preprocessing import MinMaxScaler
        scaler = MinMaxScaler()

        normalization_df = features_polynomial.copy()
        normalization_df[:] = scaler.fit_transform(normalization_df[:])

        # x_train, x_test, y_train, y_test = train_test_split(normalization_df, y, train_size=0.8, test_size=0.2)

        x_train = x.copy()
        x_test = x.copy()
        y_train = y.copy()
        y_test = y.copy()

        regression = LinearRegression()
        regression.fit(x_train, y_train)

        y_predict = regression.predict(x_test)

        print(x_test['기준_년_코드'])
        print("predict")
        print(y_predict.tolist())
        print("answer")
        print(y_test)

        return json.dumps(y_predict.tolist())

@app.route("/test")
def test():
        return "test"

if __name__ == "__main__":
        # print(simulation("개포2동", "한식음식점"))
        app.run(debug=False, host="127.0.0.1", port=5000)
