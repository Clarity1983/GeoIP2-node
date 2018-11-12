import { cloneDeep } from 'lodash';
import mmdb = require('maxmind');
import * as fixture from '../fixtures/geoip2.json';
import * as asnFixture from '../fixtures/geolite2-asn.json';
import { AddressNotFoundError, BadMethodCallError } from './errors';
import ReaderModel from './readerModel';

describe('ReaderModel', () => {
  describe('city()', () => {
    const testFixture = {
      city: fixture.city,
      continent: fixture.continent as mmdb.ContinentRecord,
      country: fixture.country,
      location: fixture.location,
      maxmind: fixture.maxmind,
      postal: fixture.postal,
      registered_country: fixture.registered_country,
      represented_country: fixture.represented_country,
      subdivisions: fixture.subdivisions,
      traits: fixture.traits as mmdb.TraitsRecord,
    };

    const mmdbReader = {
      get(ipAddress: string) {
        if (ipAddress === 'fail.fail') {
          return null;
        }

        if (ipAddress === 'empty') {
          return {};
        }
        return testFixture;
      },
      metadata: {
        binaryFormatMajorVersion: 1,
        binaryFormatMinorVersion: 2,
        buildEpoch: new Date(),
        databaseType: 'GeoIP2-City-Super-Special',
        description: 'hello',
        ipVersion: 5,
        languages: ['en'],
        nodeByteSize: 1,
        nodeCount: 1,
        recordSize: 1,
        searchTreeSize: 1,
        treeDepth: 1,
      },
    };

    it('returns city data', () => {
      const cityInstance = new ReaderModel(mmdbReader);
      expect(cityInstance.city('123.123')).toEqual(testFixture);
      expect(cityInstance.city('123.123').traits.ip_address).toEqual('123.123');
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const cityInstance = new ReaderModel(errReader);
      expect(() => cityInstance.city('123.123')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', () => {
      const cityInstance = new ReaderModel(mmdbReader);
      expect(() => cityInstance.city('fail.fail')).toThrow(
        AddressNotFoundError
      );
    });

    it('returns empty objects/arrays', () => {
      const cityInstance = new ReaderModel(mmdbReader);
      const expected = {
        city: {},
        continent: {},
        country: {},
        location: {},
        maxmind: {},
        postal: {},
        registered_country: {},
        represented_country: {},
        subdivisions: [],
        traits: {
          ip_address: 'empty',
        },
      };

      expect(cityInstance.city('empty')).toEqual(expected);
    });
  });

  describe('country()', () => {
    const testFixture = {
      continent: fixture.continent as mmdb.ContinentRecord,
      country: fixture.country,
      maxmind: fixture.maxmind,
      registered_country: fixture.registered_country,
      represented_country: fixture.represented_country,
      traits: fixture.traits as mmdb.TraitsRecord,
    };

    const mmdbReader = {
      get(ipAddress: string) {
        if (ipAddress === 'fail.fail') {
          return null;
        }

        if (ipAddress === 'empty') {
          return {};
        }
        return testFixture;
      },
      metadata: {
        binaryFormatMajorVersion: 1,
        binaryFormatMinorVersion: 2,
        buildEpoch: new Date(),
        databaseType: 'GeoIP2-Country-Super-Special',
        description: 'hello',
        ipVersion: 5,
        languages: ['en'],
        nodeByteSize: 1,
        nodeCount: 1,
        recordSize: 1,
        searchTreeSize: 1,
        treeDepth: 1,
      },
    };

    it('returns city data', () => {
      const countryInstance = new ReaderModel(mmdbReader);
      expect(countryInstance.country('123.123')).toEqual(testFixture);
      expect(countryInstance.country('123.123').traits.ip_address).toEqual(
        '123.123'
      );
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const countryInstance = new ReaderModel(errReader);
      expect(() => countryInstance.country('123.123')).toThrow(
        BadMethodCallError
      );
    });

    it('throws an error if IP address is not in database', () => {
      const countryInstance = new ReaderModel(mmdbReader);
      expect(() => countryInstance.country('fail.fail')).toThrow(
        AddressNotFoundError
      );
    });

    it('returns empty objects/arrays', () => {
      const countryInstance = new ReaderModel(mmdbReader);
      const expected = {
        continent: {},
        country: {},
        maxmind: {},
        registered_country: {},
        represented_country: {},
        traits: {
          ip_address: 'empty',
        },
      };

      expect(countryInstance.country('empty')).toEqual(expected);
    });
  });

  describe('asn()', () => {
    const mmdbReader = {
      get(ipAddress: string) {
        if (ipAddress === 'fail.fail') {
          return null;
        }

        if (ipAddress === 'empty') {
          return {};
        }
        return asnFixture;
      },
      metadata: {
        binaryFormatMajorVersion: 1,
        binaryFormatMinorVersion: 2,
        buildEpoch: new Date(),
        databaseType: 'GeoLite2-ASN',
        description: 'hello',
        ipVersion: 5,
        languages: ['en'],
        nodeByteSize: 1,
        nodeCount: 1,
        recordSize: 1,
        searchTreeSize: 1,
        treeDepth: 1,
      },
    };

    it('returns asn data', () => {
      const asnInstance = new ReaderModel(mmdbReader);
      expect(asnInstance.asn('123.123')).toEqual(asnFixture);
      expect(asnInstance.asn('123.123').ip_address).toEqual('123.123');
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const asnInstance = new ReaderModel(errReader);
      expect(() => asnInstance.asn('123.123')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', () => {
      const asnInstance = new ReaderModel(mmdbReader);
      expect(() => asnInstance.asn('fail.fail')).toThrow(AddressNotFoundError);
    });

    it('returns empty objects/arrays', () => {
      const asnInstance = new ReaderModel(mmdbReader);
      const expected = {
        ip_address: 'empty',
      };

      expect(asnInstance.asn('empty')).toEqual(expected);
    });
  });
});