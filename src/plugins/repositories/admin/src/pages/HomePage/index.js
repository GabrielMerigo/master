import React, { memo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout, HeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Main } from '@strapi/design-system/Main';
import { Typography } from '@strapi/design-system/Typography';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import {  } from '@strapi/design-system/Link';
import { useIntl } from 'react-intl';

const Wrapper = styled.div`
  padding:  18px 30px;
`;

const HomePage = () => {
  const [rows, setRows] = useState([]);
  const { formatMessage } = useIntl();

  useEffect(() => {
    const getRepos = async () => {
      const response = await fetch('https://api.github.com/users/React-avancado/repos');
      const data = await response.json();
      setRows(data);
    }
    getRepos();
  }, [])

  return (
    <Wrapper>
    <Layout>
          <Main>
            <HeaderLayout
              title={'Repositories'}
              subtitle={formatMessage({
                id: 'app.components.ListPluginsPage.description',
                defaultMessage: 'List of the installed plugins in the project.',
              })}
            />
            <ContentLayout>
              <Table colCount={2}>
                <Thead>
                  <Tr>
                    <Th>
                      <Typography variant="sigma" textColor="neutral600">
                        {formatMessage({
                          id: 'global.name',
                          defaultMessage: 'Name',
                        })}
                      </Typography>
                    </Th>
                    <Th>
                      <Typography variant="sigma" textColor="neutral600">
                        {formatMessage({
                          id: 'global.description',
                          defaultMessage: 'description',
                        })}
                      </Typography>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rows.map(({ name, html_url, description }) => {
                    return (
                      <Tr key={name}>
                        <Td>
                          <Typography textColor="neutral800" variant="omega" fontWeight="bold">
                            <a href={html_url}>{name}</a>
                          </Typography>
                        </Td>
                        <Td>
                          <Typography textColor="neutral800">{description}</Typography>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </ContentLayout>
          </Main>
        </Layout>
    </Wrapper>
  );
};

export default memo(HomePage);
