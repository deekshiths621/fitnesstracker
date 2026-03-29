import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  gap: 24px;
  padding: 0px 24px;

  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const BackButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.primaryDark};
  }
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const DataCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 8px 0;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ danger, theme }) => (danger ? "#ef4444" : theme.primary)};
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ danger }) => (danger ? "#dc2626" : "var(--primary-dark)")};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WarningBox = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 12px;
  color: #92400e;
  font-size: 13px;
  line-height: 1.5;
`;

const SuccessBox = styled.div`
  background: #d1fae5;
  border-left: 4px solid #10b981;
  border-radius: 8px;
  padding: 12px;
  color: #065f46;
  font-size: 13px;
  line-height: 1.5;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const ModalDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ primary, theme }) => (primary ? theme.primary : "transparent")};
  color: ${({ primary, theme }) => (primary ? "white" : theme.primary)};
  border: ${({ primary, theme }) =>
    primary ? "none" : `2px solid ${theme.primary}`};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ primary, theme }) =>
      primary ? theme.primaryDark : theme.primary};
    color: white;
  }
`;

const SystemData = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [lastBackup, setLastBackup] = useState("2024-03-28 14:30:00");
  const [lastCacheClean, setLastCacheClean] = useState("2024-03-27 10:15:00");

  const systemStats = {
    databaseSize: "245 MB",
    totalRecords: 15420,
    cacheSize: "12 MB",
    logSize: "85 MB",
  };

  const handleBackupDatabase = () => {
    setModalAction("backup");
    setShowModal(true);
  };

  const handleCacheClear = () => {
    setModalAction("cache");
    setShowModal(true);
  };

  const handleExportData = () => {
    setModalAction("export");
    setShowModal(true);
  };

  const handleLogsCleanup = () => {
    setModalAction("logs");
    setShowModal(true);
  };

  const confirmAction = () => {
    const actions = {
      backup: () => {
        setLastBackup(new Date().toLocaleString());
        alert("Database backup completed successfully!");
      },
      cache: () => {
        setLastCacheClean(new Date().toLocaleString());
        alert("Cache cleared successfully!");
      },
      export: () => {
        alert("Exporting data... This may take a few moments.");
      },
      logs: () => {
        alert("Old logs cleaned up successfully!");
      },
    };

    actions[modalAction]?.();
    setShowModal(false);
  };

  const getModalContent = () => {
    const contents = {
      backup: {
        title: "Backup Database?",
        description:
          "This will create a complete backup of your database. The backup will be stored securely. Continue?",
      },
      cache: {
        title: "Clear Cache?",
        description:
          "This will clear all cached data. Users may experience slower response times until cache rebuilds.",
      },
      export: {
        title: "Export All Data?",
        description:
          "This will export all system data to a CSV file. The file will be ready for download shortly.",
      },
      logs: {
        title: "Clean Logs?",
        description:
          "This will remove logs older than 30 days. Make sure you have backups before proceeding.",
      },
    };

    return contents[modalAction] || {};
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Maintain System Data</Title>
          <BackButton onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </BackButton>
        </Header>

        <DataGrid>
          <DataCard>
            <CardTitle>💾 Database Management</CardTitle>
            <CardDescription>
              Manage your database backups and maintenance
            </CardDescription>
            <InfoBox>
              <strong>Database Size:</strong> {systemStats.databaseSize}
              <br />
              <strong>Total Records:</strong> {systemStats.totalRecords}
              <br />
              <strong>Last Backup:</strong> {lastBackup}
            </InfoBox>
            <ActionButton onClick={handleBackupDatabase}>
              🔄 Backup Database
            </ActionButton>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Regular backups help protect your data
            </div>
          </DataCard>

          <DataCard>
            <CardTitle>⚡ Cache Management</CardTitle>
            <CardDescription>Manage application cache and performance</CardDescription>
            <InfoBox>
              <strong>Cache Size:</strong> {systemStats.cacheSize}
              <br />
              <strong>Last Cleaned:</strong> {lastCacheClean}
            </InfoBox>
            <ActionButton onClick={handleCacheClear}>
              🗑️ Clear Cache
            </ActionButton>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Clear cache to free up memory
            </div>
          </DataCard>

          <DataCard>
            <CardTitle>📊 Data Export</CardTitle>
            <CardDescription>Export system data for analysis</CardDescription>
            <InfoBox>
              <strong>Data Format:</strong> CSV
              <br />
              <strong>Scope:</strong> All Users & Workouts
            </InfoBox>
            <ActionButton onClick={handleExportData}>
              📥 Export Data
            </ActionButton>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Download all data in CSV format
            </div>
          </DataCard>

          <DataCard>
            <CardTitle>📝 Log Management</CardTitle>
            <CardDescription>Clean up and manage system logs</CardDescription>
            <InfoBox>
              <strong>Log Size:</strong> {systemStats.logSize}
              <br />
              <strong>Retention Period:</strong> 30 days
            </InfoBox>
            <ActionButton onClick={handleLogsCleanup}>
              🧹 Clean Old Logs
            </ActionButton>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Remove logs older than 30 days
            </div>
          </DataCard>

          <DataCard>
            <CardTitle>⚠️ System Health</CardTitle>
            <CardDescription>Monitor system status and health</CardDescription>
            <SuccessBox>✅ Database: Healthy</SuccessBox>
            <SuccessBox>✅ API: Responding (12ms avg)</SuccessBox>
            <SuccessBox>✅ Uptime: 99.9%</SuccessBox>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              All systems operational
            </div>
          </DataCard>

          <DataCard>
            <CardTitle>🔐 Security Settings</CardTitle>
            <CardDescription>Manage security and data protection</CardDescription>
            <WarningBox>
              ⚠️ Regular backups are essential for data security
            </WarningBox>
            <WarningBox>
              ⚠️ Always test backups before relying on them
            </WarningBox>
            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
              Last security audit: 2024-03-20
            </div>
          </DataCard>
        </DataGrid>
      </Wrapper>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{getModalContent().title}</ModalTitle>
            <ModalDescription>{getModalContent().description}</ModalDescription>
            <ModalButtons>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button primary onClick={confirmAction}>
                Confirm
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default SystemData;
