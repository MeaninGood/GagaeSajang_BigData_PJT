import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import LabelInput from '../../molecules/LabelInput';
import ProfessionalResult from '../../organisms/ProfessionalResult/new';
import { useProfessionalResult } from '../../../hooks/professional';
import { ProfessionalResultParams } from '../../../models/professional';
import Button from '../../atoms/Button';
import SimulationPage from './SimulationPage';
import { useProSalesSimulation } from '../../../hooks/simulation';
import Spinner from '../../atoms/Spinner';
import { usePostCode } from '../../../hooks/common';
import { cs1, cs2, cs3 } from '../../../data/cs';
import JobSearchInput from '../../molecules/JobSearchInput';
import { areas, DongItem } from '../../../data/areaDong';
import { useUserStoreInfo, useStoreInfoFix } from '../../../hooks/user';
import Label from '../../atoms/Label';
import Input from '../../atoms/Input';

interface ProfessionalStoreInfo extends ProfessionalResultParams {
  id: number;
}

const ProfessionalStorePage = () => {
  const userEmail = sessionStorage.getItem('email');
  const [guDong, setGuDong] = useState('');

  // 업종 검색창
  const jobList = [...cs1, ...cs2, ...cs3];
  const [jobKeyword, setJobKeyword] = useState(''); // 검색 input
  const [isJobSearchResultOpen, setIsJobSearchResultOpen] =
    useState<boolean>(false);
  const [jobSearchResult, setJobSearchResult] = useState<string[]>([]);
  const jobSearchResultRef = useRef<any>();
  // API 요청에 보낼 데이터
  const [selectedJobSearch, setSelectedJobSearch] =
    useState<string | undefined>(undefined); // 검색 결과 => 직업 이름

  useEffect(() => {
    if (jobKeyword) {
      const tmp = jobList.filter((e: any, i) => e.includes(jobKeyword));
      setJobSearchResult(tmp);
      if (tmp.length > 0) {
        setIsJobSearchResultOpen(true);
      }
    }
  }, [jobKeyword]);

  const onJobChange = useCallback((e: any) => {
    setJobKeyword(e.target.value);
  }, []);

  const selectJobItem = useCallback((item: any) => {
    setSelectedJobSearch(item);
    setIsJobSearchResultOpen(false);
  }, []);
  const clearJobItem = useCallback(
    () => setSelectedJobSearch(undefined),
    [setSelectedJobSearch]
  );

  // 지역 검색창
  const [dongKeyword, setDongKeyword] = useState(''); // 검색 input
  const [isDongSearchResultOpen, setIsDongSearchResultOpen] =
    useState<boolean>(false);
  const [dongSearchResult, setDongSearchResult] = useState<string[]>([]);
  const dongSearchResultRef = useRef<any>();
  // API 요청에 보낼 데이터
  const [selectedDongSearch, setSelectedDongSearch] =
    useState<string | undefined>(undefined); // 검색 결과 => 직업 이름

  const onDongChange = useCallback((e: any) => {
    setDongKeyword(e.target.value);
  }, []);

  const selectDongItem = useCallback((item: any) => {
    setSelectedDongSearch(item);
    setIsDongSearchResultOpen(false);
  }, []);
  const clearDongItem = useCallback(
    () => setSelectedDongSearch(undefined),
    [setSelectedDongSearch]
  );

  // 동 검색
  useEffect(() => {
    if (dongKeyword) {
      const tmp = areas
        .filter((e: DongItem, i) => e.name.includes(dongKeyword))
        .map((e: DongItem) => e.name);
      setDongSearchResult(tmp);
      if (tmp.length > 0) {
        setIsDongSearchResultOpen(true);
      }
    }
  }, [dongKeyword]);

  const [storeInform, setStoreInform] = useState<ProfessionalStoreInfo>({
    id: 0,
    email: userEmail,
    sales: 0,
    clerk: 0,
    area: 0,
    dongName: selectedDongSearch,
    industryName: selectedJobSearch,
  });
  const [content, setContent] = useState<number>(0);

  const userStoreInfo = useUserStoreInfo();
  useEffect(() => {
    if (userStoreInfo.isSuccess) {
      console.log('가게 정보 확인', userStoreInfo.data);
      setStoreInform(userStoreInfo.data);
      setContent(1);
    } else if (userStoreInfo.isError) {
      console.log('정보 없음');
    }
  }, [userStoreInfo]);

  useEffect(() => {
    setStoreInform({
      ...storeInform,
      dongName: selectedDongSearch,
      industryName: selectedJobSearch,
    });
    console.log('위치 업종 정보 바뀜!!', storeInform);
  }, [selectedDongSearch, selectedJobSearch]);

  const changeStoreInform = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('change', e.target.value);
    setStoreInform({
      ...storeInform,
      [e.target.id]: Number(e.target.value),
    });
  };

  const onClickHandler = () => {
    if (storeInform.dongName && storeInform.industryName) {
      setContent(2);
      console.log('content', content);
    }
  };

  return (
    <Wrapper
      onClick={(e) => {
        if (!jobSearchResultRef.current.contains(e.target)) {
          setIsJobSearchResultOpen(false);
        }
      }}
    >
      <ProSide>
        <ProList>
          <ProListItem>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: '10px 0 10px 0',
              }}
            >
              🏪 내 가게 정보
            </div>
          </ProListItem>
          <JobSearchInput
            label="가게 주소"
            placeholder="행정동을 입력해주세요."
            inputValue={selectedDongSearch}
            onChange={onDongChange}
            searchResult={dongSearchResult}
            searchResultOpen={isDongSearchResultOpen}
            searchResultRef={dongSearchResultRef}
            selectItem={selectDongItem}
            clearValue={clearDongItem}
          />
          <JobSearchInput
            label="업종"
            placeholder="가게 업종을 입력해주세요."
            inputValue={selectedJobSearch}
            onChange={onJobChange}
            searchResult={jobSearchResult}
            searchResultOpen={isJobSearchResultOpen}
            searchResultRef={jobSearchResultRef}
            selectItem={selectJobItem}
            clearValue={clearJobItem}
          />
          <ProListItem>
            <Label style={{ marginBottom: '0.6rem', fontSize: '1.05rem' }}>
              직원 수
            </Label>
            <Input
              placeholder="직원 수를 입력해주세요. (숫자만)"
              inputId="clert"
              onChange={changeStoreInform}
              inputValue={storeInform.clerk.toString()}
            />
          </ProListItem>
          <ProListItem>
            <Label style={{ marginBottom: '0.6rem', fontSize: '1.05rem' }}>
              가게 면적
            </Label>
            <Input
              placeholder="가게 면적을 입력해주세요. (숫자만)"
              inputId="clert"
              onChange={changeStoreInform}
              inputValue={storeInform.area.toString()}
            />
          </ProListItem>
          <ProListItem>
            <Label style={{ marginBottom: '0.6rem', fontSize: '1.05rem' }}>
              평균 월 매출
            </Label>
            <Input
              placeholder="평균 월 매출을 입력해주세요. (숫자만)"
              inputId="clert"
              onChange={changeStoreInform}
              inputValue={storeInform.sales.toString()}
            />
          </ProListItem>
        </ProList>
        <Button
          type="border"
          style={{
            width: '100%',
          }}
          onClick={onClickHandler}
        >
          내 가게 분석하기
        </Button>
      </ProSide>
      {/* {!userStoreInfo.isLoading && content === 0 && (
        <ProReport>
          <InitialReport>
            처음 뵙겠습니다, 사장님!<br></br>가게 정보를 입력하고 내 가게 분석을
            시작해봐요.
          </InitialReport>
        </ProReport>
      )}
      {!userStoreInfo.isLoading && content === 1 && (
        <ProReport>
          <InitialReport>
            사장님, 또 뵙네요! <br></br>이미 저장된 가게 정보가 있네요.
            <br></br>수정 없이 분석을 진행하시려면 분석하기 버튼을 눌러주세요.
          </InitialReport>
        </ProReport>
      )} */}
      {/* {!userStoreInfo.isLoading && content === 2 && (
        <ProReport>
          <ProfessionalResult
            info={{
              email: storeInform.email,
              sales: storeInform.sales,
              clerk: storeInform.clerk,
              area: storeInform.area,
              dongName: storeInform.dongName,
              industryName: storeInform.industryName,
            }}
          />
          <SimulationPage></SimulationPage>
        </ProReport>
      )} */}
      {/* <ProReport> */}
      <ProfessionalResult
        info={{
          email: storeInform.email,
          sales: storeInform.sales,
          clerk: storeInform.clerk,
          area: storeInform.area,
          dongName: storeInform.dongName,
          industryName: storeInform.industryName,
        }}
      />
      {/* <SimulationPage /> */}
      {/* </ProReport> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 65px);
`;

const ProSide = styled.div`
  width: 300px;
  flex-shrink: 0;
  /* background: ${({ theme }) => theme.lightColor}; */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ProList = styled.div`
  flex-grow: 1;
  color: #3e4b5b;
  & div + div {
    margin-top: 1rem;
  }
`;

const ProListItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* margin-bottom: 10px; */
`;

const ProReport = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow-y: scroll;
  left: 450px;
  background: #f2edf3;
  transition: 0.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default ProfessionalStorePage;
