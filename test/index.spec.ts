import * as swarmCid from '../src/index'

const testReference = 'ca6357a08e317d15ec560fef34e4c45f8f19f01c372aa70f1da72bfa7f1a4338'
const testManifestCid = 'bah5acgzazjrvpieogf6rl3cwb7xtjzgel6hrt4a4g4vkody5u4v7u7y2im4a'
const testFeedCid = 'bah5qcgzazjrvpieogf6rl3cwb7xtjzgel6hrt4a4g4vkody5u4v7u7y2im4a'

const cidV1WithDagPB = 'bafybeiekkklkqtypmqav6ytqjbdqucxfwuk5cgige4245d2qhkccuyfnly'
const cidV1WithDagPB_reference = '8a5296a84f0f64015f627048470a0ae5b515d119062735ce8f503a842a60ad5e'

describe('Encoding/decoding', () => {
  it('should encode and then decode to same reference', async () => {
    const cid = swarmCid.encodeReference(testReference, swarmCid.ReferenceType.MANIFEST)

    expect(cid.code).toEqual(swarmCid.SWARM_MANIFEST_CODEC)
    expect(cid.toString()).toEqual(testManifestCid)

    expect(swarmCid.decodeCid(cid)).toMatchObject({
      reference: testReference,
      type: swarmCid.ReferenceType.MANIFEST,
    })
  })
  it('should encode and then decode with base32 string to same reference', async () => {
    const cid = swarmCid.encodeReference(testReference, swarmCid.ReferenceType.FEED)
    const cidString = cid.toString()

    expect(swarmCid.decodeCid(cidString)).toMatchObject({
      reference: testReference,
      type: swarmCid.ReferenceType.FEED,
    })
  })

  it('should encode manifest and then decode with base32 string to same reference', async () => {
    const cid = swarmCid.encodeManifestReference(testReference)
    const cidString = cid.toString()

    expect(cid.code).toEqual(swarmCid.SWARM_MANIFEST_CODEC)
    expect(cid.toString()).toEqual(testManifestCid)

    expect(swarmCid.decodeCid(cidString)).toMatchObject({
      reference: testReference,
      type: swarmCid.ReferenceType.MANIFEST,
    })
    expect(swarmCid.decodeManifestCid(cidString)).toEqual(testReference)
    expect(() => swarmCid.decodeFeedCid(cidString)).toThrow(Error)
  })

  it('should encode feed and then decode with base32 string to same reference', async () => {
    const cid = swarmCid.encodeFeedReference(testReference)
    const cidString = cid.toString()

    expect(cid.code).toEqual(swarmCid.SWARM_FEED_CODEC)
    expect(cid.toString()).toEqual(testFeedCid)

    expect(swarmCid.decodeCid(cidString)).toMatchObject({
      reference: testReference,
      type: swarmCid.ReferenceType.FEED,
    })
    expect(swarmCid.decodeFeedCid(cidString)).toEqual(testReference)
    expect(() => swarmCid.decodeManifestCid(cidString)).toThrow(Error)
  })
})

describe('Error handling', () => {
  it('should not throw for incompatible codec when using generic decoding ', async () => {
    expect(swarmCid.decodeCid(cidV1WithDagPB)).toMatchObject({
      reference: cidV1WithDagPB_reference,
      type: undefined,
    })
  })

  it('should throw when expecting specific codec', async () => {
    expect(() => swarmCid.decodeFeedCid(cidV1WithDagPB)).toThrow(Error)
    expect(() => swarmCid.decodeManifestCid(cidV1WithDagPB)).toThrow(Error)
  })

  it('should throw when invalid cid', async () => {
    expect(() => swarmCid.decodeCid('some invalid cid')).toThrow(Error)
    expect(() => swarmCid.decodeCid('someInvalidCid')).toThrow(Error)
  })
})
