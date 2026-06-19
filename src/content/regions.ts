import { Region } from '../engine/types';

export const REGIONS: Region[] = [
  {
    id: 'north',
    nameId: 'region_north_name',
    events: [
      {
        id: 'north_event_1',
        textId: 'north_event_1_desc',
        challenge: {
          id: 'north_chall_1',
          type: 'anomaly',
          textId: 'north_chall_1_desc',
          hintTextId: 'north_chall_1_hint',
          choices: [
            {
              id: 'north_c1_correct',
              textId: 'north_c1_correct_text',
              consequenceTextId: 'north_c1_correct_cons',
              cost: { time: -1, fare: -100 },
              givesMemory: true,
              helpsPassenger: true,
            },
            {
              id: 'north_c1_incorrect',
              textId: 'north_c1_incorrect_text',
              consequenceTextId: 'north_c1_incorrect_cons',
              cost: { time: -3, fare: -50 },
            }
          ],
          correctChoiceId: 'north_c1_correct'
        }
      },
      {
        id: 'north_event_2',
        textId: 'north_event_2_desc',
        challenge: {
          id: 'north_chall_2',
          type: 'decision',
          textId: 'north_chall_2_desc',
          hintTextId: 'north_chall_2_hint',
          choices: [
            {
              id: 'north_c2_option_a',
              textId: 'north_c2_option_a_text',
              consequenceTextId: 'north_c2_option_a_cons',
              cost: { time: -2, fare: -150 },
              givesMemory: true,
              givesSecretTicket: true // 這邊隱藏了一張秘密車票
            },
            {
              id: 'north_c2_option_b',
              textId: 'north_c2_option_b_text',
              consequenceTextId: 'north_c2_option_b_cons',
              cost: { time: -1, fare: -200 },
              helpsPassenger: true
            }
          ]
        }
      }
    ]
  },
  {
    id: 'hsinchu_miaoli',
    nameId: 'region_hsinchu_miaoli_name',
    events: [
      {
        id: 'hsinchu_miaoli_event_1',
        textId: 'hsinchu_miaoli_event_1_desc',
        challenge: {
          id: 'hsinchu_miaoli_chall_1',
          type: 'dialogue',
          textId: 'hsinchu_miaoli_chall_1_desc',
          hintTextId: 'hsinchu_miaoli_chall_1_hint',
          choices: [
            {
              id: 'hm_c1_correct',
              textId: 'hm_c1_correct_text',
              consequenceTextId: 'hm_c1_correct_cons',
              cost: { time: -2, fare: -100 },
              givesMemory: true,
              helpsPassenger: true
            },
            {
              id: 'hm_c1_incorrect',
              textId: 'hm_c1_incorrect_text',
              consequenceTextId: 'hm_c1_incorrect_cons',
              cost: { time: -4, fare: 0 }
            }
          ],
          correctChoiceId: 'hm_c1_correct'
        }
      },
      {
        id: 'hsinchu_miaoli_event_2',
        textId: 'hsinchu_miaoli_event_2_desc',
        challenge: {
          id: 'hsinchu_miaoli_chall_2',
          type: 'decision',
          textId: 'hsinchu_miaoli_chall_2_desc',
          hintTextId: 'hsinchu_miaoli_chall_2_hint',
          choices: [
            {
              id: 'hm_c2_opt1',
              textId: 'hm_c2_opt1_text',
              consequenceTextId: 'hm_c2_opt1_cons',
              cost: { time: -1, fare: -120 },
              givesMemory: true
            },
            {
              id: 'hm_c2_opt2',
              textId: 'hm_c2_opt2_text',
              consequenceTextId: 'hm_c2_opt2_cons',
              cost: { time: -3, fare: -50 }
            }
          ]
        }
      }
    ]
  },
  {
    id: 'central',
    nameId: 'region_central_name',
    events: [
      {
        id: 'central_event_1',
        textId: 'central_event_1_desc',
        challenge: {
          id: 'central_chall_1',
          type: 'dialogue',
          textId: 'central_chall_1_desc',
          hintTextId: 'central_chall_1_hint',
          choices: [
            {
              id: 'central_c1_correct',
              textId: 'central_c1_correct_text',
              consequenceTextId: 'central_c1_correct_cons',
              cost: { time: -2, fare: -100 },
              givesMemory: true,
              helpsPassenger: true
            },
            {
              id: 'central_c1_incorrect',
              textId: 'central_c1_incorrect_text',
              consequenceTextId: 'central_c1_incorrect_cons',
              cost: { time: -3, fare: -50 }
            }
          ],
          correctChoiceId: 'central_c1_correct'
        }
      },
      {
        id: 'central_event_2',
        textId: 'central_event_2_desc',
        challenge: {
          id: 'central_chall_2',
          type: 'anomaly',
          textId: 'central_chall_2_desc',
          hintTextId: 'central_chall_2_hint',
          choices: [
            {
              id: 'central_c2_correct',
              textId: 'central_c2_correct_text',
              consequenceTextId: 'central_c2_correct_cons',
              cost: { time: -1, fare: -200 },
              givesMemory: true
            },
            {
              id: 'central_c2_incorrect',
              textId: 'central_c2_incorrect_text',
              consequenceTextId: 'central_c2_incorrect_cons',
              cost: { time: -2, fare: -50 }
            }
          ],
          correctChoiceId: 'central_c2_correct'
        }
      }
    ]
  },
  {
    id: 'south_west',
    nameId: 'region_south_west_name',
    events: [
      {
        id: 'south_west_event_1',
        textId: 'south_west_event_1_desc',
        challenge: {
          id: 'south_west_chall_1',
          type: 'anomaly',
          textId: 'south_west_chall_1_desc',
          hintTextId: 'south_west_chall_1_hint',
          choices: [
            {
              id: 'sw_c1_correct',
              textId: 'sw_c1_correct_text',
              consequenceTextId: 'sw_c1_correct_cons',
              cost: { time: -2, fare: -80 },
              givesMemory: true,
              helpsPassenger: true
            },
            {
              id: 'sw_c1_incorrect',
              textId: 'sw_c1_incorrect_text',
              consequenceTextId: 'sw_c1_incorrect_cons',
              cost: { time: -3, fare: -30 }
            }
          ],
          correctChoiceId: 'sw_c1_correct'
        }
      },
      {
        id: 'south_west_event_2',
        textId: 'south_west_event_2_desc',
        challenge: {
          id: 'south_west_chall_2',
          type: 'decision',
          textId: 'south_west_chall_2_desc',
          hintTextId: 'south_west_chall_2_hint',
          choices: [
            {
              id: 'sw_c2_opt1',
              textId: 'sw_c2_opt1_text',
              consequenceTextId: 'sw_c2_opt1_cons',
              cost: { time: -1, fare: -150 },
              givesMemory: true
            },
            {
              id: 'sw_c2_opt2',
              textId: 'sw_c2_opt2_text',
              consequenceTextId: 'sw_c2_opt2_cons',
              cost: { time: -2, fare: -100 }
            }
          ]
        }
      }
    ]
  },
  {
    id: 'kaohsiung_pingtung',
    nameId: 'region_kaohsiung_pingtung_name',
    events: [
      {
        id: 'kaohsiung_pingtung_event_1',
        textId: 'kaohsiung_pingtung_event_1_desc',
        challenge: {
          id: 'kaohsiung_pingtung_chall_1',
          type: 'dialogue',
          textId: 'kaohsiung_pingtung_chall_1_desc',
          hintTextId: 'kaohsiung_pingtung_chall_1_hint',
          choices: [
            {
              id: 'kp_c1_correct',
              textId: 'kp_c1_correct_text',
              consequenceTextId: 'kp_c1_correct_cons',
              cost: { time: -2, fare: -100 },
              givesMemory: true,
              helpsPassenger: true
            },
            {
              id: 'kp_c1_incorrect',
              textId: 'kp_c1_incorrect_text',
              consequenceTextId: 'kp_c1_incorrect_cons',
              cost: { time: -3, fare: -50 }
            }
          ],
          correctChoiceId: 'kp_c1_correct'
        }
      },
      {
        id: 'kaohsiung_pingtung_event_2',
        textId: 'kaohsiung_pingtung_event_2_desc',
        challenge: {
          id: 'kaohsiung_pingtung_chall_2',
          type: 'decision',
          textId: 'kaohsiung_pingtung_chall_2_desc',
          hintTextId: 'kaohsiung_pingtung_chall_2_hint',
          choices: [
            {
              id: 'kp_c2_opt1',
              textId: 'kp_c2_opt1_text',
              consequenceTextId: 'kp_c2_opt1_cons',
              cost: { time: -1, fare: -150 },
              givesMemory: true
            },
            {
              id: 'kp_c2_opt2',
              textId: 'kp_c2_opt2_text',
              consequenceTextId: 'kp_c2_opt2_cons',
              cost: { time: -2, fare: -80 }
            }
          ]
        }
      }
    ]
  },
  {
    id: 'east',
    nameId: 'region_east_name',
    events: [
      {
        id: 'east_event_1',
        textId: 'east_event_1_desc',
        challenge: {
          id: 'east_chall_1',
          type: 'anomaly',
          textId: 'east_chall_1_desc',
          hintTextId: 'east_chall_1_hint',
          choices: [
            {
              id: 'east_c1_correct',
              textId: 'east_c1_correct_text',
              consequenceTextId: 'east_c1_correct_cons',
              cost: { time: -2, fare: -100 },
              givesMemory: true,
              helpsPassenger: true
            },
            {
              id: 'east_c1_incorrect',
              textId: 'east_c1_incorrect_text',
              consequenceTextId: 'east_c1_incorrect_cons',
              cost: { time: -3, fare: -50 }
            }
          ],
          correctChoiceId: 'east_c1_correct'
        }
      },
      {
        id: 'east_event_2',
        textId: 'east_event_2_desc',
        challenge: {
          id: 'east_chall_2',
          type: 'decision',
          textId: 'east_chall_2_desc',
          hintTextId: 'east_chall_2_hint',
          choices: [
            {
              id: 'east_c2_opt1',
              textId: 'east_c2_opt1_text',
              consequenceTextId: 'east_c2_opt1_cons',
              cost: { time: -1, fare: -150 },
              givesMemory: true
            },
            {
              id: 'east_c2_opt2',
              textId: 'east_c2_opt2_text',
              consequenceTextId: 'east_c2_opt2_cons',
              cost: { time: -2, fare: -80 }
            }
          ]
        }
      }
    ]
  },
  {
    id: 'penghu',
    nameId: 'region_penghu_name',
    events: [
      {
        id: 'penghu_event_1',
        textId: 'penghu_event_1_desc',
        challenge: {
          id: 'penghu_chall_1',
          type: 'dialogue',
          textId: 'penghu_chall_1_desc',
          hintTextId: 'penghu_chall_1_hint',
          choices: [
            {
              id: 'penghu_c1_opt1',
              textId: 'penghu_c1_opt1_text',
              consequenceTextId: 'penghu_c1_opt1_cons',
              cost: { time: 0, fare: 0 },
              givesMemory: true
            }
          ]
        }
      }
    ]
  }
];

export const REGION_SEQUENCE = ['north', 'hsinchu_miaoli', 'central', 'south_west', 'kaohsiung_pingtung', 'east'];
