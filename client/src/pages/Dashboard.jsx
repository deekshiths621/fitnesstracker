import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { counts } from "../Utils/data";
import CountCard from "../components/cards/CountCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import PersonalRecords from "../components/cards/PersonalRecords";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import EmptyState from "../components/EmptyState";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 0px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.primaryDark};
    }
  }
`;
const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  @media (max-width: 600px) {
    gap: 20px;
  }
`;
const Title = styled.div`
  padding: 0px 24px;
  font-size: 28px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 700;
  letter-spacing: -0.5px;
  @media (max-width: 600px) {
    font-size: 22px;
    padding: 0px 16px;
  }
`;
const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 24px;
  padding: 0px 24px;
  @media (max-width: 600px) {
    gap: 16px;
    padding: 0px 16px;
  }
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 24px;
  gap: 24px;
  @media (max-width: 600px) {
    gap: 16px;
    padding: 0px 16px;
  }
`;
const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 16px;
  }
`;

const Dashboard = () => {
  const [data, setData] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);

  const dashboardData = async () => {
    const token = localStorage.getItem("fittrack-app-token");
    await getDashboardDetails(token).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };
  const getTodaysWorkout = async () => {
    const token = localStorage.getItem("fittrack-app-token");
    await getWorkouts(token, "").then((res) => {
      setTodaysWorkouts(res?.data?.todaysWorkouts);
      console.log(res.data);
    });
  };

  const addNewWorkout = async (workoutString) => {
    setButtonLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    await addWorkout(token, { workoutString })
      .then((res) => {
        dashboardData();
        getTodaysWorkout();
        setButtonLoading(false);
      })
      .catch((err) => {
        alert(err);
        setButtonLoading(false);
      });
  };

  useEffect(() => {
    dashboardData();
    getTodaysWorkout();
  }, []);
  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        <FlexWrap>
          {counts.map((item) => (
            <CountCard item={item} data={data} />
          ))}
        </FlexWrap>

        <FlexWrap>
          <WeeklyStatCard data={data} />
          <CategoryChart data={data} />
          <PersonalRecords data={data} />
        </FlexWrap>

        <FlexWrap>
          <AddWorkout
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>

        <Section>
          <Title>Todays Workouts</Title>
          {todaysWorkouts?.length > 0 ? (
            <CardWrapper>
              {todaysWorkouts.map((workout) => (
                <WorkoutCard workout={workout} key={workout._id} />
              ))}
            </CardWrapper>
          ) : (
            <EmptyState 
              title="No Workouts Today"
              message="Add your first workout above to get started!"
            />
          )}
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
